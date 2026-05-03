# CodexPet 🐾

**The ultimate desktop pets directory.** Discover and download the best desktop pets — from AI coding companions to classic mascots.

🌐 **Live site:** [codexpet.space](https://codexpet.space)

## Features

- 📂 Categorized pet directory (AI tools, indie, classic, browser)
- ⭐ Featured pets showcase
- 🔍 SEO-optimized with sitemap, robots.txt, and structured data
- 📱 Fully responsive design
- 📝 MDX-based content — easy to add new pets
- 🚀 Static site generation for blazing fast performance

## Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **MDX** for content
- **Vercel** for deployment

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Adding a New Pet

Create a new `.mdx` file in `content/pets/`:

```mdx
---
name: "Pet Name"
description: "Short description"
category: "ai-tool"  # ai-tool | indie | classic | browser
platform: ["windows", "macos", "linux"]
image: "/imgs/pets/pet-name.svg"
downloadUrl: "https://..."
featured: false
tags: ["tag1", "tag2"]
author: "Author Name"
stars: 1000
---

# Pet Name

Full description in Markdown...
```

## Project Structure

```
├── content/pets/          # MDX pet entries
├── public/imgs/pets/      # Pet images
├── src/
│   ├── app/
│   │   ├── page.tsx       # Homepage
│   │   ├── pets/[slug]/   # Pet detail pages
│   │   ├── category/      # Category pages
│   │   ├── submit/        # Submit a pet
│   │   ├── sitemap.ts     # SEO sitemap
│   │   └── robots.ts      # SEO robots
│   └── shared/
│       ├── components/    # UI components
│       └── lib/           # Data layer
└── next.config.ts
```

## License

MIT
