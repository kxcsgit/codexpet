export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-extrabold text-gray-900">🐾 Submit a Pet</h1>
      <p className="mb-8 text-gray-500">
        Know a great desktop pet? Share it with the community!
      </p>

      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        className="space-y-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Pet Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            placeholder="e.g. Desktop Goose"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            placeholder="What makes this pet special?"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Download / Source URL *
          </label>
          <input
            type="url"
            name="url"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          >
            <option value="ai-tool">AI Tool</option>
            <option value="indie">Indie</option>
            <option value="classic">Classic</option>
            <option value="browser">Browser Extension</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Platforms
          </label>
          <div className="flex gap-4">
            {["Windows", "macOS", "Linux", "Browser"].map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="platform" value={p.toLowerCase()} />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Your Email (optional)
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            placeholder="For follow-up only, won't be published"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-indigo-600 py-3 font-semibold text-white shadow hover:bg-indigo-700"
        >
          Submit Pet →
        </button>
      </form>
    </div>
  );
}
