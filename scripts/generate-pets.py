#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量宠物精灵图生成脚本 — CodexPet (codexpet.space)

功能概述:
  - 从 new-pets.yaml 读取新宠物定义
  - 通过 gpt-image-2 API 生成参考图 + 9 行动画精灵条
  - 拼接为 8×9 (1536×1872) 精灵图集，转 WebP 输出
  - 自动生成 content/pets/{slug}.mdx 元数据文件

使用方法:
  # 确保已安装依赖
  pip install Pillow requests pyyaml

  # 设置环境变量
  export IMAGE_API_BASE_URL="https://api.kie.ai"
  export IMAGE_API_KEY="your-kie-ai-api-key"

  # 预览（不实际调用 API）
  python scripts/generate-pets.py --dry-run

  # 生成所有宠物
  python scripts/generate-pets.py

  # 只生成指定宠物
  python scripts/generate-pets.py --pet glitch-ghost

  # 指定配置文件
  python scripts/generate-pets.py --config scripts/new-pets.yaml

作者: CodexPet 自动化工具
"""

import argparse
import os
import sys
import time
import hashlib
import tempfile
import traceback
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    print("❌ 缺少 requests 库，请运行: pip install requests")
    sys.exit(1)

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("❌ 缺少 Pillow 库，请运行: pip install Pillow")
    sys.exit(1)

try:
    import yaml
except ImportError:
    print("❌ 缺少 pyyaml 库，请运行: pip install pyyaml")
    sys.exit(1)

# ============================================================
# 常量配置
# ============================================================

# 精灵图规格
CELL_WIDTH = 192          # 每帧宽度 (px)
CELL_HEIGHT = 208         # 每帧高度 (px)
COLS = 8                  # 每行帧数
ROWS = 9                  # 动画行数
SHEET_WIDTH = COLS * CELL_WIDTH   # 1536
SHEET_HEIGHT = ROWS * CELL_HEIGHT # 1872

# 动画行定义: (行索引, 动画名称, 英文描述关键词)
ANIMATION_ROWS = [
    (0, "idle",       "idle standing still, subtle breathing animation"),
    (1, "walk-right", "walking to the right, side view, legs moving"),
    (2, "walk-left",  "walking to the left, side view mirrored, legs moving"),
    (3, "wave",       "waving hello with one arm raised, friendly greeting"),
    (4, "jump",       "jumping up with arms raised, mid-air pose, energetic"),
    (5, "sad",        "looking sad, drooping posture, tear or downcast eyes"),
    (6, "review",     "reviewing code, reading a tiny screen or paper, focused expression"),
    (7, "sleep",      "sleeping, eyes closed, zzz particles, curled up peacefully"),
    (8, "extra",      "doing a fun trick or spin, celebrating with sparkles"),
]

# API 模型名称
API_MODEL = "gpt-image-2-text-to-image"

# 轮询配置
POLL_INTERVAL = 5         # 轮询间隔 (秒)
POLL_TIMEOUT = 300        # 单任务超时 (秒)
MAX_RETRIES = 3           # 最大重试次数
RETRY_DELAY = 10          # 重试等待 (秒)

# ============================================================
# 提示词构建
# ============================================================

def build_reference_prompt(pet: dict) -> str:
    """
    构建参考图提示词。
    参考图用于确定宠物的整体风格一致性。
    """
    appearance = pet.get("appearance", "a cute pixel art pet character")
    color = pet.get("color_scheme", "vibrant colors")
    size = pet.get("size", "small, about 48x48 pixel art style")

    return (
        f"A single {size} game sprite of {appearance}. "
        f"Color palette: {color}. "
        f"Pixel art style, clean edges, transparent-friendly background, "
        f"front-facing, neutral standing pose, centered in frame. "
        f"High quality, consistent style, suitable for a desktop pet game. "
        f"White or light gray background."
    )


def build_row_prompt(pet: dict, row_index: int, anim_name: str, anim_desc: str) -> str:
    """
    构建单行动画提示词。
    生成一行 8 帧水平排列的精灵条。

    Args:
        pet: 宠物定义字典
        row_index: 动画行索引 (0-8)
        anim_name: 动画名称
        anim_desc: 动画描述关键词
    """
    appearance = pet.get("appearance", "a cute pixel art pet character")
    color = pet.get("color_scheme", "vibrant colors")
    size = pet.get("size", "small, about 48x48 pixel art style")

    return (
        f"A horizontal sprite strip of exactly 8 frames showing a {size} game sprite: {appearance}. "
        f"The animation is: {anim_name} — {anim_desc}. "
        f"Color palette: {color}. "
        f"Arrange 8 consecutive animation frames side by side in a single horizontal row, "
        f"each frame showing a slightly different pose to create a smooth animation sequence. "
        f"Pixel art style, clean edges, consistent character design across all 8 frames, "
        f"uniform spacing between frames, white or light gray background for each frame. "
        f"The strip should be exactly 8 frames wide and 1 frame tall. "
        f"High quality pixel art, suitable for a desktop pet game."
    )

# ============================================================
# API 交互层
# ============================================================

class ImageAPI:
    """封装 gpt-image-2 API 调用逻辑。"""

    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        })

    def create_task(self, prompt: str) -> str:
        """
        创建图像生成任务。

        Args:
            prompt: 图像生成提示词

        Returns:
            taskId: 任务 ID

        Raises:
            RuntimeError: API 返回错误时
        """
        url = f"{self.base_url}/api/v1/jobs/createTask"
        payload = {
            "model": API_MODEL,
            "input": {
                "prompt": prompt,
                "aspect_ratio": "auto",
            },
        }

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = self.session.post(url, json=payload, timeout=30)
                resp.raise_for_status()
                data = resp.json()

                # kie.ai 返回 {code: 200, data: "taskId字符串"} 或 {code: 0, data: {taskId: "..."}}
                if data.get("code") in (200, 0, "200", "0"):
                    raw = data.get("data")
                    if isinstance(raw, str) and raw:
                        return raw  # kie.ai 直接返回 taskId 字符串
                    if isinstance(raw, dict):
                        task_id = raw.get("taskId") or raw.get("task_id") or raw.get("id")
                        if task_id:
                            return task_id
                    # 兜底
                    task_id = data.get("result", {}).get("taskId") or data.get("taskId")
                    if task_id:
                        return task_id
                    raise RuntimeError(f"API 响应中未找到 taskId: {data}")
                else:
                    msg = data.get("message", data.get("msg", str(data)))
                    raise RuntimeError(f"API 错误: {msg}")

            except requests.exceptions.RequestException as e:
                if attempt < MAX_RETRIES:
                    print(f"    ⚠ 创建任务失败 (尝试 {attempt}/{MAX_RETRIES}): {e}")
                    time.sleep(RETRY_DELAY)
                else:
                    raise RuntimeError(f"创建任务失败，已重试 {MAX_RETRIES} 次: {e}")

    def poll_task(self, task_id: str) -> str:
        """
        轮询任务直到完成，返回结果图片 URL。

        Args:
            task_id: 任务 ID

        Returns:
            result_url: 生成图片的下载 URL

        Raises:
            RuntimeError: 超时或任务失败时
        """
        url = f"{self.base_url}/api/v1/jobs/recordInfo"
        start_time = time.time()

        while True:
            elapsed = time.time() - start_time
            if elapsed > POLL_TIMEOUT:
                raise RuntimeError(f"任务 {task_id} 超时 ({POLL_TIMEOUT}s)")

            try:
                resp = self.session.get(
                    url,
                    params={"taskId": task_id},
                    timeout=30,
                )
                resp.raise_for_status()
                data = resp.json()

                # 尝试多种响应结构 (kie.ai 返回 data 嵌套)
                record = data.get("data", data.get("result", data))
                if isinstance(record, dict) and "data" in record:
                    record = record["data"]
                status = str(record.get("status", record.get("state", record.get("taskStatus", ""))))

                # 任务完成 (kie.ai: status=1 表示成功)
                if status in ("1", "2", "success", "completed", "done", "5"):
                    result_json = record.get("resultJson", record.get("result", record.get("output", {})))
                    if isinstance(result_json, str):
                        import json
                        try:
                            result_json = json.loads(result_json)
                        except Exception:
                            pass

                    urls = result_json.get("resultUrls", result_json.get("urls", []))
                    if urls and urls[0]:
                        return urls[0]

                    # 尝试其他字段
                    url_field = record.get("imageUrl") or record.get("url")
                    if url_field:
                        return url_field

                    raise RuntimeError(f"任务完成但未找到结果 URL: {data}")

                # 任务失败
                if status in ("-1", "3", "failed", "error"):
                    raise RuntimeError(f"任务失败: {data}")

                # 显示进度
                progress_pct = min(95, int(elapsed / 42 * 100))
                sys.stdout.write(f"\r    ⏳ 等待中... {elapsed:.0f}s (~{progress_pct}%)")
                sys.stdout.flush()

            except requests.exceptions.RequestException as e:
                print(f"\n    ⚠ 轮询请求失败: {e}，稍后重试...")

            time.sleep(POLL_INTERVAL)

    def download_image(self, image_url: str, save_path: Path) -> None:
        """
        下载图片到本地文件。

        Args:
            image_url: 图片 URL
            save_path: 保存路径
        """
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = requests.get(image_url, timeout=120, stream=True)
                resp.raise_for_status()
                with open(save_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=8192):
                        f.write(chunk)
                return
            except Exception as e:
                if attempt < MAX_RETRIES:
                    print(f"    ⚠ 下载失败 (尝试 {attempt}/{MAX_RETRIES}): {e}")
                    time.sleep(RETRY_DELAY)
                else:
                    raise RuntimeError(f"下载图片失败: {e}")


# ============================================================
# 图像合成
# ============================================================

def compose_spritesheet(row_images: list, output_path: Path) -> None:
    """
    将 9 行精灵条图片合成为 8×9 精灵图集。

    Args:
        row_images: 9 个图片路径列表 (按行顺序)
        output_path: 输出 WebP 文件路径
    """
    atlas = Image.new("RGBA", (SHEET_WIDTH, SHEET_HEIGHT), (255, 255, 255, 0))

    for row_idx, img_path in enumerate(row_images):
        if img_path is None or not img_path.exists():
            # 缺失行用占位图
            placeholder = Image.new("RGBA", (SHEET_WIDTH, CELL_HEIGHT), (200, 200, 200, 128))
            draw = ImageDraw.Draw(placeholder)
            draw.text(
                (SHEET_WIDTH // 2 - 40, CELL_HEIGHT // 2 - 8),
                f"Row {row_idx}",
                fill=(100, 100, 100, 200),
            )
            atlas.paste(placeholder, (0, row_idx * CELL_HEIGHT))
            continue

        strip = Image.open(img_path).convert("RGBA")

        # 将生成的条带缩放到精灵图标准宽度和单元格高度
        expected_strip_width = SHEET_WIDTH    # 1536 = 8 * 192
        expected_strip_height = CELL_HEIGHT   # 208

        if strip.size != (expected_strip_width, expected_strip_height):
            # 按比例缩放：先按宽度缩放，再裁剪/填充高度
            ratio = expected_strip_width / strip.width
            new_h = int(strip.height * ratio)
            strip = strip.resize((expected_strip_width, new_h), Image.LANCZOS)

            if new_h > expected_strip_height:
                # 裁剪高度
                strip = strip.crop((0, 0, expected_strip_width, expected_strip_height))
            elif new_h < expected_strip_height:
                # 填充高度
                padded = Image.new(
                    "RGBA",
                    (expected_strip_width, expected_strip_height),
                    (255, 255, 255, 0),
                )
                padded.paste(strip, (0, 0))
                strip = padded

        atlas.paste(strip, (0, row_idx * CELL_HEIGHT))

    # 保存为 WebP
    atlas.save(str(output_path), "WEBP", quality=90, method=6)
    print(f"  ✅ 精灵图集已保存: {output_path} ({SHEET_WIDTH}×{SHEET_HEIGHT})")


def generate_mdx(pet: dict, project_root: Path) -> Path:
    """
    生成 MDX 元数据文件（如果不存在）。

    Args:
        pet: 宠物定义字典
        project_root: 项目根目录

    Returns:
        mdx_path: MDX 文件路径
    """
    slug = pet["slug"]
    mdx_path = project_root / "content" / "pets" / f"{slug}.mdx"

    if mdx_path.exists():
        print(f"  ℹ MDX 文件已存在，跳过: {mdx_path}")
        return mdx_path

    name = pet.get("name", slug.replace("-", " ").title())
    description = pet.get("description", f"A cute desktop pet: {name}")
    category = pet.get("category", "ai-tool")
    platforms = pet.get("platform", ["browser"])
    tags = pet.get("tags", [slug])
    featured = str(pet.get("featured", False)).lower()

    platform_str = "\n".join(f'  - "{p}"' for p in platforms)
    tags_str = ", ".join(f'"{t}"' for t in tags)

    mdx_content = f"""---
name: "{name}"
description: "{description}"
category: "{category}"
platform:
{platform_str}
image: "/pets/{slug}/spritesheet.webp"
downloadUrl: "#"
featured: {featured}
tags: [{tags_str}]
spriteRow: 0
spriteFrames: 6
spriteDuration: "1100ms"
---

# {name}

{description}

## Install locally

```bash
mkdir -p ~/.codex/pets/{slug}
unzip {slug}.zip -d ~/.codex/pets/{slug}
```

Generated for Petdex.
"""
    mdx_path.parent.mkdir(parents=True, exist_ok=True)
    mdx_path.write_text(mdx_content, encoding="utf-8")
    print(f"  ✅ MDX 文件已生成: {mdx_path}")
    return mdx_path


# ============================================================
# 主流程
# ============================================================

def load_pets_config(config_path: Path) -> list:
    """
    加载宠物配置文件。

    Args:
        config_path: YAML 配置文件路径

    Returns:
        pets: 宠物定义列表
    """
    if not config_path.exists():
        print(f"❌ 配置文件不存在: {config_path}")
        sys.exit(1)

    with open(config_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    pets = data.get("pets", [])
    if not pets:
        print("⚠ 配置文件中未找到宠物定义 (pets 字段为空)")
    return pets


def load_env_file(project_root: Path):
    """尝试从 .env.local 加载环境变量。"""
    for env_file in [".env.local", ".env"]:
        env_path = project_root / env_file
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key and key not in os.environ:
                        os.environ[key] = val
            break


def validate_environment():
    """验证必要的环境变量是否已设置。"""
    base_url = os.environ.get("IMAGE_API_BASE_URL")
    api_key = os.environ.get("IMAGE_API_KEY")

    if not base_url:
        # 默认使用 kie.ai
        base_url = "https://api.kie.ai"
        os.environ["IMAGE_API_BASE_URL"] = base_url
        print(f"ℹ 未设置 IMAGE_API_BASE_URL，使用默认: {base_url}")
    if not api_key:
        print("❌ 环境变量 IMAGE_API_KEY 未设置")
        print("   请运行: export IMAGE_API_KEY=\"your-api-key\"")
        sys.exit(1)

    return base_url, api_key


def generate_pet(pet: dict, api: ImageAPI, project_root: Path, tmp_dir: Path) -> bool:
    """
    为单个宠物生成完整的精灵图集。

    流程:
      1. 生成参考图（用于风格锚定，可选）
      2. 逐行生成 9 条动画精灵条
      3. 合成 8×9 精灵图集
      4. 保存为 WebP
      5. 生成 MDX 元数据

    Args:
        pet: 宠物定义字典
        api: API 客户端实例
        project_root: 项目根目录
        tmp_dir: 临时文件目录

    Returns:
        success: 是否成功完成
    """
    slug = pet["slug"]
    name = pet.get("name", slug)
    pet_tmp = tmp_dir / slug
    pet_tmp.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*60}")
    print(f"🐾 生成宠物: {name} ({slug})")
    print(f"{'='*60}")

    row_images = []

    for row_idx, anim_name, anim_desc in ANIMATION_ROWS:
        strip_path = pet_tmp / f"row_{row_idx}_{anim_name}.webp"

        # 如果已有缓存，跳过（支持断点续传）
        if strip_path.exists() and strip_path.stat().st_size > 1000:
            print(f"  ⏭ 行 {row_idx} ({anim_name}): 已有缓存，跳过")
            row_images.append(strip_path)
            continue

        print(f"\n  🎬 行 {row_idx}/{ROWS-1} — {anim_name}")
        print(f"     {anim_desc}")

        prompt = build_row_prompt(pet, row_idx, anim_name, anim_desc)

        for retry in range(1, MAX_RETRIES + 1):
            try:
                # 创建任务
                print(f"    📤 创建任务... (尝试 {retry}/{MAX_RETRIES})")
                task_id = api.create_task(prompt)
                print(f"    🆔 任务 ID: {task_id}")

                # 轮询等待
                result_url = api.poll_task(task_id)
                print(f"\n    📥 结果 URL: {result_url[:80]}...")

                # 下载图片
                api.download_image(result_url, strip_path)
                print(f"    💾 已下载: {strip_path} ({strip_path.stat().st_size / 1024:.1f} KB)")

                row_images.append(strip_path)
                break  # 成功，跳出重试循环

            except Exception as e:
                print(f"\n    ❌ 行 {row_idx} 生成失败 (尝试 {retry}/{MAX_RETRIES}): {e}")
                if retry < MAX_RETRIES:
                    print(f"    ⏳ 等待 {RETRY_DELAY}s 后重试...")
                    time.sleep(RETRY_DELAY)
                else:
                    print(f"    ⛔ 行 {row_idx} 最终失败，将使用占位图")
                    row_images.append(None)

    # 合成精灵图集
    print(f"\n  🔧 合成精灵图集 ({SHEET_WIDTH}×{SHEET_HEIGHT})...")
    spritesheet_dir = project_root / "public" / "pets" / slug
    spritesheet_dir.mkdir(parents=True, exist_ok=True)
    spritesheet_path = spritesheet_dir / "spritesheet.webp"

    compose_spritesheet(row_images, spritesheet_path)

    # 生成 MDX
    generate_mdx(pet, project_root)

    # 统计
    generated = sum(1 for img in row_images if img is not None)
    total = len(row_images)
    print(f"\n  📊 完成: {generated}/{total} 行成功生成")

    return generated == total


def main():
    """脚本主入口。"""
    parser = argparse.ArgumentParser(
        description="🐾 CodexPet 批量精灵图生成工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python scripts/generate-pets.py --dry-run
  python scripts/generate-pets.py
  python scripts/generate-pets.py --pet glitch-ghost
  python scripts/generate-pets.py --config my-pets.yaml

环境变量:
  IMAGE_API_BASE_URL  API 基础 URL (必需)
  IMAGE_API_KEY       API 密钥 (必需)
        """,
    )
    parser.add_argument(
        "--config",
        type=str,
        default="scripts/new-pets.yaml",
        help="宠物配置文件路径 (默认: scripts/new-pets.yaml)",
    )
    parser.add_argument(
        "--pet",
        type=str,
        default=None,
        help="只生成指定 slug 的宠物",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="预览模式，不实际调用 API",
    )
    parser.add_argument(
        "--project-root",
        type=str,
        default=None,
        help="项目根目录 (默认: 脚本所在目录的父目录)",
    )

    args = parser.parse_args()

    # 确定项目根目录
    if args.project_root:
        project_root = Path(args.project_root).resolve()
    else:
        # 脚本位于 scripts/generate-pets.py，项目根在上一级
        script_dir = Path(__file__).resolve().parent
        project_root = script_dir.parent

    print(f"🐾 CodexPet 批量精灵图生成工具")
    print(f"📁 项目根目录: {project_root}")
    print(f"📋 配置文件: {args.config}")
    print(f"📅 启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # 加载配置
    config_path = Path(args.config)
    if not config_path.is_absolute():
        config_path = project_root / config_path

    pets = load_pets_config(config_path)

    # 过滤指定宠物
    if args.pet:
        pets = [p for p in pets if p.get("slug") == args.pet]
        if not pets:
            print(f"❌ 未在配置中找到宠物: {args.pet}")
            sys.exit(1)

    # 预览模式
    if args.dry_run:
        print(f"\n{'='*60}")
        print(f"🔍 预览模式 — 以下宠物将被生成:")
        print(f"{'='*60}")
        for i, pet in enumerate(pets, 1):
            slug = pet.get("slug", "???")
            name = pet.get("name", slug)
            desc = pet.get("description", "无描述")
            appearance = pet.get("appearance", "未指定")
            print(f"\n  {i}. {name} ({slug})")
            print(f"     描述: {desc}")
            print(f"     外观: {appearance}")
            print(f"     输出: public/pets/{slug}/spritesheet.webp")
            print(f"     MDX:  content/pets/{slug}.mdx")
            print(f"     动画行: {ROWS} 行 × {COLS} 帧 = {ROWS * COLS} 帧")
            print(f"     预计 API 调用: {ROWS} 次 (约 {ROWS * 42}s)")

        total_calls = len(pets) * ROWS
        total_time = total_calls * 42
        print(f"\n{'='*60}")
        print(f"📊 总计:")
        print(f"   宠物数量:    {len(pets)}")
        print(f"   API 调用数:  {total_calls}")
        print(f"   预计耗时:    ~{total_time // 60} 分 {total_time % 60} 秒")
        print(f"{'='*60}")
        print(f"\n💡 提示: 去掉 --dry-run 参数以开始实际生成")
        return

    # 加载 .env 文件
    load_env_file(project_root)

    # 验证环境
    base_url, api_key = validate_environment()
    api = ImageAPI(base_url, api_key)

    # 创建临时目录
    tmp_dir = Path(tempfile.mkdtemp(prefix="codexpet_gen_"))
    print(f"🗂 临时目录: {tmp_dir}")

    # 逐个生成
    total = len(pets)
    success_count = 0
    failed_slugs = []
    start_time = time.time()

    for i, pet in enumerate(pets, 1):
        print(f"\n{'━'*60}")
        print(f"  进度: [{i}/{total}]")
        print(f"{'━'*60}")

        try:
            ok = generate_pet(pet, api, project_root, tmp_dir)
            if ok:
                success_count += 1
            else:
                failed_slugs.append(pet.get("slug", "unknown"))
        except KeyboardInterrupt:
            print(f"\n\n⚠ 用户中断！已完成 {i-1}/{total} 个宠物")
            failed_slugs.append(pet.get("slug", "unknown"))
            break
        except Exception as e:
            print(f"\n  ❌ 生成宠物 {pet.get('slug')} 时发生未预期错误: {e}")
            traceback.print_exc()
            failed_slugs.append(pet.get("slug", "unknown"))

    # 最终报告
    elapsed = time.time() - start_time
    elapsed_min = int(elapsed // 60)
    elapsed_sec = int(elapsed % 60)

    print(f"\n{'='*60}")
    print(f"🏁 批量生成完成!")
    print(f"{'='*60}")
    print(f"  ✅ 成功: {success_count}/{total}")
    if failed_slugs:
        print(f"  ❌ 失败: {', '.join(failed_slugs)}")
    print(f"  ⏱ 总耗时: {elapsed_min} 分 {elapsed_sec} 秒")
    print(f"  🗂 临时文件: {tmp_dir}")
    print(f"  💡 提示: 临时文件可安全删除: rm -rf {tmp_dir}")

    if failed_slugs:
        sys.exit(1)


if __name__ == "__main__":
    main()
