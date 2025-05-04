Project Purpose:
This project is a web application designed to display a leaderboard for Large Language Model (LLM) coding benchmarks. Specifically, it presents results from running the "Aider Polyglot Benchmarks" on various LLMs, including potentially smaller or less common models not found on official leaderboards. It's presented as an unofficial resource managed by the @techfrens community (or user aj47). The goal seems to be finding the best value (cost) and speed for coding tasks using different LLMs.
Technology Stack:
Frontend Framework: Next.js (using the App Router structure - src/app/) with React and TypeScript.
Styling: Tailwind CSS (globals.css, tailwind.config.js isn't shown but implied by package.json and globals.css). It uses a dark "hacker" theme with green and cyan accents.
Data Source: YAML (src/data/models.yaml) is used to store the benchmark data for each LLM.
Data Loading: A custom utility (src/utils/yamlLoader.ts) uses the js-yaml library and Node.js fs module to read and parse the YAML data. This happens during the build process because it uses fs.
Build Configuration: next.config.js is configured for Static Site Generation (SSG) (output: 'export'). This means the next build command generates static HTML, CSS, and JS files that can be hosted on any static hosting provider.
Deployment: The presence of wrangler.toml and public/_redirects strongly suggests deployment via Cloudflare Pages. wrangler.toml defines the build command for Cloudflare, and _redirects handles routing for the static site.
Development Tools: TypeScript, ESLint (for code quality).
(Note: The index.html file at the root seems to be a remnant or perhaps an alternative implementation attempt using Vue.js, imported via an import map. However, the core application structure, package.json, and next.config.js clearly indicate the active application is built with Next.js/React. The Next.js build process will generate its own index.html in the output directory, likely ignoring the root index.html.)
Key Features & Functionality:
LLM Benchmark Leaderboard: The primary feature is displaying a table (Leaderboard.tsx) ranking LLMs based on coding benchmark results.
Data Presentation: Shows key metrics like Rank, Model Name, Pass Rate (overall and per language), Speed per Case, and Cost. Pass rate is visualized with a progress bar.
Sorting: Users can sort the leaderboard table by Pass Rate, Speed, or Cost. Sorting direction (ascending/descending) can be toggled.
Language-Specific Sorting: Users can select a specific programming language (JavaScript, Python, Java, C++, Go, Rust) to view and sort models based on their pass rate for that language.
View Modes: Offers a "Simple" and "Detailed" view of the leaderboard. The detailed view adds columns like first pass rate, run date, error counts, etc.
Detailed Model Information: Clicking on a row in the leaderboard opens a modal (ModelDetailModal.tsx) displaying comprehensive details for that specific benchmark run, including:
Basic info (model name, edit format, date, command used, versions).
Performance metrics (pass rates, counts, well-formed responses, speed, cost).
Token usage (total, prompt, completion, averages).
Error analysis (malformed responses, timeouts, specific error types).
Language-specific pass rates.
Metadata like whether the model is open source or sponsored.
Visual Flair: Includes a "Digital Rain" background effect (DigitalRain.tsx) using HTML Canvas for thematic styling.
Community Links: Provides links to the @techfrens Discord server and the project's GitHub repository.
Sponsorship: Includes a button/link to sponsor a benchmark run for a chosen model.
Responsiveness: The CSS includes media queries (@media) suggesting the layout adapts to different screen sizes.
Directory Structure Breakdown:
aj47-techfren-leaderboard/: Root directory.
index.html: (Likely unused by the Next.js build) Static HTML file with Vue.js code.
LICENSE: MIT License file.
next-env.d.ts, next.config.js, package.json, tsconfig.json: Next.js and project configuration files.
wrangler.toml: Cloudflare Workers/Pages configuration.
.npmrc: Specifies not to use package-lock.json.
public/: Static assets served directly.
_redirects: Cloudflare Pages redirect rule for SPA/static routing.
robots.txt: Instructions for web crawlers.
src/: Source code for the Next.js application.
app/: Next.js App Router directory.
globals.css: Global styles (Tailwind CSS).
layout.tsx: Root layout component (HTML structure, metadata).
page.tsx: The main page component for the root route (/). Loads data and renders the leaderboard.
components/: Reusable React components.
DigitalRain.tsx: Canvas-based background effect.
Leaderboard.tsx: The main interactive leaderboard table component.
ModelDetailModal.tsx: Modal component to show detailed model info.
data/: Data files.
models.yaml: Stores the raw benchmark data.
utils/: Utility functions.
yamlLoader.ts: Function to load and parse the models.yaml file during the build.
In Summary:
This is a statically generated web application built with Next.js, React, and TypeScript, styled with Tailwind CSS. Its purpose is to present a sortable and detailed leaderboard of coding benchmark results for various LLMs, using data stored in a YAML file. It's designed for easy deployment on Cloudflare Pages and encourages community interaction and potential sponsorship for adding new benchmark results.
