# @techfrens Coding LLM Benchmarks (aj47-techfren-leaderboard)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project presents an unofficial leaderboard for Large Language Model (LLM) coding benchmarks, specifically focusing on results from running the [Aider Polyglot Benchmarks](https://aider.chat/docs/leaderboards/).

The goal is to provide insights into the performance (pass rate), speed, and cost associated with various LLMs for coding tasks. This leaderboard includes models that may not appear on official lists, such as smaller, newer, or less common ones.

It's a community-driven effort hosted by `@techfrens` / `aj47`.

**Live Site URL:** [https://techfren.net/](https://techfren.net/) (or replace with the actual deployment URL)

## Key Features

*   **Interactive Leaderboard:** Displays LLM benchmark results in a sortable table.
*   **Core Metrics:** Ranks models based on Pass Rate, Speed per Case (lower is better), and Cost.
*   **Sorting:** Allows users to sort the leaderboard by the main metrics (Pass Rate, Speed, Cost).
*   **Language-Specific Filtering & Sorting:** Filter and sort results based on performance in specific languages (JavaScript, Python, Java, C++, Go, Rust).
*   **Detailed View:** Toggle between a simple overview and a detailed table view showing more metrics (first pass rate, date, errors, etc.).
*   **Model Details Modal:** Click on any model row to see a comprehensive breakdown of its benchmark run, including:
    *   Basic run information (command, versions, date, edit format)
    *   Detailed performance metrics (pass counts, well-formed responses)
    *   Token usage statistics (total, prompt, completion, averages)
    *   Error analysis (malformed responses, timeouts, syntax errors)
    *   Language-specific pass rates
    *   Metadata (Open Source status, Sponsor)
*   **Visual Flair:** Features a "Digital Rain" background effect for thematic styling.
*   **Community Links:** Provides easy access to the [@techfrens Discord](https://discord.gg/cK9WeQ7jPq) and the [GitHub Repository](https://github.com/aj47/techfren-leaderboard).
*   **Sponsorship:** Includes information on how to sponsor a benchmark run for a specific model.
*   **Responsive Design:** Adapts to various screen sizes.

## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (v14+ with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Data:** Benchmark results stored in [YAML](https://yaml.org/) (`src/data/models.yaml`).
*   **Data Parsing:** [js-yaml](https://github.com/nodeca/js-yaml) library.
*   **Deployment:** Configured for Static Site Generation (`output: 'export'`) and deployment via [Cloudflare Pages](https://pages.cloudflare.com/) (indicated by `wrangler.toml` and `public/_redirects`).

## GitDiagram:

```mermaid
flowchart TD
    %% Build-Time Components
    subgraph "Build-Time" 
        direction TB
        Dev["Developer Local"]:::build
        GH["GitHub Repo"]:::build
        CI["CI/CD Build"]:::build
        NXConfig["next.config.js"]:::build
        TSConfig["tsconfig.json"]:::build
        Package["package.json"]:::build
        IndexHTML["index.html"]:::build
        Wrangler["wrangler.toml"]:::build
        ModelsYAML["models.yaml"]:::build
        YamlLoader["yamlLoader.ts"]:::build
        NextBuild["Next.js Build Process"]:::build
        AppRouter["App Router (layout.tsx, page.tsx, globals.css)"]:::build
    end

    %% Deployment Components
    subgraph "Deployment" 
        direction TB
        StaticAssets["public/"]:::deploy
        Cloudflare["Cloudflare Pages + CDN"]:::deploy
    end

    %% Client-Side Runtime
    subgraph "Client-Side" 
        direction TB
        Browser["User Browser"]:::runtime
        Leaderboard["Leaderboard.tsx"]:::runtime
        Modal["ModelDetailModal.tsx"]:::runtime
        DigitalRain["DigitalRain.tsx"]:::runtime
    end

    %% Relationships
    Dev -->|commits code| GH
    GH -->|triggers| CI
    CI -->|runs build| NextBuild
    NextBuild -->|reads config| NXConfig
    NextBuild -->|reads config| TSConfig
    NextBuild -->|reads manifest| Package
    NextBuild -->|reads fallback| IndexHTML
    NextBuild -->|reads deploy config| Wrangler
    NextBuild -->|loads data| ModelsYAML
    NextBuild -->|parses YAML| YamlLoader
    YamlLoader -->|provides props| NextBuild
    NextBuild -->|uses app router| AppRouter
    NextBuild -->|outputs| StaticAssets
    StaticAssets --> Cloudflare
    Cloudflare -->|serves static files| Browser
    Browser -->|hydrates| Leaderboard
    Browser -->|opens modal| Modal
    Browser -->|renders effect| DigitalRain

    %% Click Events
    click NXConfig "https://github.com/rsrini7/techfren-leaderboard/blob/main/next.config.js"
    click Wrangler "https://github.com/rsrini7/techfren-leaderboard/blob/main/wrangler.toml"
    click StaticAssets "https://github.com/rsrini7/techfren-leaderboard/tree/main/public/"
    click AppRouter "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/app/layout.tsx"
    click AppRouter "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/app/page.tsx"
    click AppRouter "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/app/globals.css"
    click ModelsYAML "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/data/models.yaml"
    click YamlLoader "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/utils/yamlLoader.ts"
    click Leaderboard "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/components/Leaderboard.tsx"
    click Modal "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/components/ModelDetailModal.tsx"
    click DigitalRain "https://github.com/rsrini7/techfren-leaderboard/blob/main/src/components/DigitalRain.tsx"
    click TSConfig "https://github.com/rsrini7/techfren-leaderboard/blob/main/tsconfig.json"
    click IndexHTML "https://github.com/rsrini7/techfren-leaderboard/blob/main/index.html"
    click Package "https://github.com/rsrini7/techfren-leaderboard/blob/main/package.json"

    %% Styles
    classDef build fill:#ADD8E6,stroke:#000,stroke-width:1px
    classDef deploy fill:#90EE90,stroke:#000,stroke-width:1px
    classDef runtime fill:#FFFACD,stroke:#000,stroke-width:1px
```

## Project Structure

```text
aj47-techfren-leaderboard/
├── .npmrc                # NPM configuration (disables package-lock)
├── index.html            # (Likely unused by Next.js build) Alternative Vue.js implementation
├── LICENSE               # Project license file (MIT)
├── next-env.d.ts         # Next.js TypeScript environment definitions
├── next.config.js        # Next.js configuration (static export)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── wrangler.toml         # Cloudflare Pages build configuration
├── public/               # Static assets served directly
│   ├── _redirects        # Cloudflare Pages redirect rules for SPA routing
│   └── robots.txt        # Instructions for web crawlers
└── src/                  # Main application source code
    ├── app/              # Next.js App Router directory
    │   ├── globals.css   # Global styles (Tailwind CSS)
    │   ├── layout.tsx    # Root layout component
    │   └── page.tsx      # Main page component for the leaderboard
    ├── components/       # Reusable React components
    │   ├── DigitalRain.tsx       # Canvas background effect
    │   ├── Leaderboard.tsx       # Interactive leaderboard table
    │   └── ModelDetailModal.tsx  # Modal for showing model details
    ├── data/             # Data files
    │   └── models.yaml   # LLM benchmark data
    └── utils/            # Utility functions
        └── yamlLoader.ts # Function to load and parse YAML data at build time
```

## Data Source

The benchmark data powering the leaderboard is stored in `src/data/models.yaml`. This file contains a list of models, each with its primary metrics (`passRate`, `speed`, `cost`) and a nested `details` object containing comprehensive results from the benchmark run.

The data is loaded **at build time** using the `src/utils/yamlLoader.ts` utility, which reads the YAML file using Node.js `fs` and parses it with `js-yaml`.

## Running Locally (Development)

1.  Clone the repository:
    ```bash
    git clone https://github.com/aj47/techfren-leaderboard.git
    cd techfren-leaderboard
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install or pnpm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    # or yarn dev or pnpm dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production (Static Export)

To generate the static files for deployment:

```bash
npm run build
