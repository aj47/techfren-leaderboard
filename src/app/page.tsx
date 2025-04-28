import { loadModels } from '../utils/yamlLoader';
import DigitalRain from '../components/DigitalRain';
import Leaderboard from '../components/Leaderboard';
import { Suspense } from 'react';

export default async function Home() {
  // Load models on the server side
  console.log('Home page component rendering, loading models...');
  const models = loadModels();
  console.log('Models loaded in Home component:', models);

  return (
    <div id="app">
      <DigitalRain />

      <header>
        <h1><a href="https://techfren.net" target="_blank" className="techfren-link">@techfren</a> Coding <span className="highlight">LLM</span> Benchmarks</h1>
        <h2>
          Unofficial <a href="https://aider.chat/docs/leaderboards/" target="_blank" className="aider-link">Aider</a> Polyglot Benchmarks with sorting per language
        </h2>
        <p className="header-info">
          My current mission is to find the best value and speed for money in coding LLMs.
        </p>
        <p className="header-info">
          Join the community <a href="https://discord.gg/cK9WeQ7jPq" target="_blank" className="discord-link">Discord</a> to chat or submit a model for benchmarking.
          You can also submit a pull request or issue on <a href="https://github.com/aj47/techfren-leaderboard" target="_blank" className="github-link">GitHub</a>.
        </p>
        <p className="header-info">
        </p>
      </header>

      <main>
        <Suspense fallback={<div className="loading-container"><div className="loading-spinner"></div><p>Loading...</p></div>}>
          <Leaderboard models={models} />
        </Suspense>
      </main>
    </div>
  );
}
