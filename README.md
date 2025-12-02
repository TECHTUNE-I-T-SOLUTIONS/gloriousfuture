# gloriousfuture
a school website
## Table of contents

- What this project is
- Prerequisites
- Quick start (dev & build)
- Project layout
- Development notes & conventions
- Testing & linting
- Deployment
- Contributing
- Troubleshooting
- License & contacts

## What this project is
A school website containing public pages (home, about, admissions, academics, news, contact) and an admin/content area for staff to manage content. Purpose: provide a maintainable front-end and simple content workflow so other developers can extend or deploy the site quickly.

## Prerequisites
- Node.js (LTS) and npm or yarn
- Git for version control
- Optional: Docker for containerized builds, or a hosting account (Netlify/Vercel/Azure/GCP) for deployment

## Quick start

1. Clone the repo
    - `git clone <repo-url>`
    - `cd gloriousfuture`

2. Install dependencies
    - `npm install` or `yarn install`

3. Run development server
    - `npm run dev` (or `yarn dev`)
    - Open http://localhost:3000 (or the port printed by the server)

4. Build for production
    - `npm run build`
    - Serve the output directory (e.g., `npm run start` or use a static host)

## Common scripts
- `dev` — start local dev server with hot reload
- `build` — create optimized production bundle
- `start` — serve production build locally
- `test` — run unit/integration tests
- `lint` — run static analysis and formatting

Adjust names if the project uses a different script naming convention.

## Project layout (example)
- src/
  - assets/        — images, fonts, global media
  - components/    — reusable UI components
  - pages/         — route-based pages (home, about, admissions…)
  - layouts/       — page shell and header/footer
  - styles/        — global styles, utilities, theme
  - services/      — API clients, content fetching
  - utils/         — helpers and types
- public/          — static files served as-is (robots, favicon)
- scripts/         — build/deploy helper scripts
- tests/           — unit and e2e tests
- package.json
- README.md

Tailor to actual repo layout if different.

## Routing & content
- Pages are organized under `src/pages` (or framework-specific routing). Keep routes simple and predictable (e.g., `/admissions`, `/news/:id`).
- Content may come from a CMS (headless) or markdown files under `content/`. Abstract content fetching in `services/` so switching sources is easy.

## Styling & assets
- Use a consistent system (CSS Modules, Tailwind, Sass, styled-components). Keep global theme tokens in `styles/`.
- Optimize images and serve responsive formats (WebP/AVIF) where possible.

## State, data & APIs
- Prefer local component state for UI, a minimal global store only when necessary.
- Keep data access in `services/` and return plain JS objects to components for testability.

## Testing & quality
- Unit tests: Jest + Testing Library (or framework equivalents)
- E2E tests: Cypress or Playwright for critical flows (admissions form, login)
- Linting/formatting: ESLint + Prettier. Run `npm run lint` and add pre-commit hooks (husky) if desired.

## Accessibility & SEO
- Ensure semantic HTML, alt attributes for images, and keyboard navigability.
- Add meta tags and Open Graph for social sharing. Use sitemap and robots.txt for SEO.

## Deployment
- Build artifacts are produced by `npm run build`. Deploy the output directory to your chosen host.
- Example hosts: Netlify, Vercel, GitHub Pages (static), Azure Static Web Apps, or containerize with Docker if backend integration is required.
- Use CI pipelines to run tests and builds (GitHub Actions, GitLab CI, Azure Pipelines).

### Puppeteer / PDF generation

- This project includes server-side PDF generation endpoints that use Puppeteer to render HTML reports and export PDFs. To enable this feature in your environment:
  - Install dependencies: `npm install` (Puppeteer is included in `package.json`).
  - Ensure your host supports running headless Chromium. On many managed hosts you may need to enable additional flags or use a custom Chromium binary.
  - Recommended launch flags for Puppeteer (use when launching in production): `['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--single-process']`.

- If Puppeteer cannot run in your environment, the endpoints fall back to returning an HTML report that can be printed to PDF manually.

### Deployment notes for Puppeteer

- Vercel: serverless functions may not support a full Chromium binary out-of-the-box. Use Vercel's "Edge Functions" approaches or an external PDF-generation service, or deploy to a containerized service (Docker) where Chromium is installable.
- Docker: include the necessary dependencies and a lightweight Chromium (install `chromium-browser` or use the official Puppeteer Docker images). Example Dockerfile base image: `node:20-bullseye-slim` and install `gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 libxrender1 libxss1 ca-certificates fonts-liberation lsb-release xdg-utils`.
- Azure App Service / other PaaS: prefer Docker deployment to ensure Chromium availability.

If you'd like, I can add a small Dockerfile example and a CI job to build and test PDF generation in a reproducible environment.

## Environment & secrets
- Keep secrets out of the repo; use environment variables and a secure store.
- Example `.env` entries:
  - `API_BASE_URL=https://api.example`
  - `NODE_ENV=production`

## Contributing
- Fork → feature branch → open PR with description and screenshots.
- Follow commit message conventions and run `npm run lint` and `npm test` before opening a PR.
- Add or update documentation and tests for new features.

## Troubleshooting
- Dev server not starting: check Node version and port conflicts.
- Missing dependencies: run `npm ci` or `npm install` again and clear `node_modules`.
- Build failures: run the linter/tests locally to see errors; check CI logs for environment differences.

## License & contacts
- Add project license (e.g., MIT) in LICENSE file.
- For questions or access, contact the project maintainer or school IT team (add appropriate emails in repo metadata).

Notes
- Update this README with repository-specific commands, CI links, hosting URLs, and actual project architecture details so new contributors have exact instructions.