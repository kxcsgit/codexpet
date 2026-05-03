export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
      <p className="font-mono text-xs tracking-[0.22em] text-[#5266ea] uppercase">Submit</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1a1d2e] md:text-4xl">
        Submit a Pet
      </h1>
      <p className="mt-2 text-base text-[#4f515c]">
        Know a great desktop pet? Share it with the community.
      </p>

      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        className="mt-10 space-y-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1a1d2e]">
            Pet Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-[#1a1d2e] backdrop-blur placeholder:text-stone-400 focus:border-[#6478f6]/40 focus:outline-none"
            placeholder="e.g. Desktop Goose"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1a1d2e]">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-[#1a1d2e] backdrop-blur placeholder:text-stone-400 focus:border-[#6478f6]/40 focus:outline-none"
            placeholder="What makes this pet special?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1a1d2e]">
            Download / Source URL *
          </label>
          <input
            type="url"
            name="url"
            required
            className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-[#1a1d2e] backdrop-blur placeholder:text-stone-400 focus:border-[#6478f6]/40 focus:outline-none"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1a1d2e]">
            Your Email (optional)
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-[#1a1d2e] backdrop-blur placeholder:text-stone-400 focus:border-[#6478f6]/40 focus:outline-none"
            placeholder="For follow-up only, won't be published"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
        >
          Submit Pet →
        </button>
      </form>
    </div>
  );
}
