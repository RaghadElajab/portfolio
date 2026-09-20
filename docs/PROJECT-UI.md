# Project UI

This portfolio is a static GitHub Pages site. The supplied React feature-grid
reference is adapted in native HTML, CSS and JavaScript so the existing site
continues to work without a build step.

- `index.html`: project cards, descriptions, media metadata and dialog structure.
- `polish.css`: responsive grid, compact dialog, media previews and hero font.
- `script.js`: dialog focus management, media playback and expanded charts.
- `assets/PROJECT-MEDIA.md`: video frame sources and chart data verification.
- `tools/build_project_visuals.py`: rebuilds the SVG charts and diagrams.

Preview locally with `python -m http.server 8765`, then open
`http://localhost:8765`. Videos load from Google Drive when their preview is
clicked. Each video also has a direct link. Headers and charts are local assets.

## Using the original React component

The current site has no React, TypeScript, Tailwind or shadcn runtime. For a
future React version, create a separate app with shadcn's Vite setup:

```sh
npx shadcn@latest init -t vite
```

Choose React with TypeScript. Within that generated app, run:

```sh
npx shadcn@latest add badge
npm install class-variance-authority
```

Use `src/components/ui/feature-section-with-grid.tsx` for the supplied component,
with `@/components/ui` resolving to `src/components/ui`. That directory keeps
the reusable UI together and makes the reference's imports work. The generated
badge and `src/lib/utils.ts` supply its supporting imports. Render `Feature`
from `src/App.tsx` and replace the example items with portfolio projects.
See the [official shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite).

For an existing Vite app, install `tailwindcss` and `@tailwindcss/vite`, add the
Tailwind plugin beside the React plugin, and import `tailwindcss` in the main
stylesheet (`src/index.css`). Follow the
[official Tailwind Vite instructions](https://tailwindcss.com/docs/installation/using-vite).
Configure `@/*` in both TypeScript configuration files and Vite before running
`shadcn init`, as shown in the shadcn guide.
