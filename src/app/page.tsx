import { loadModels } from '../utils/yamlLoader';
import DigitalRain from '../components/DigitalRain';
import Leaderboard from '../components/Leaderboard';

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
          Unofficial <a href="https://aider.chat/docs/leaderboards/" target="_blank" className="aider-link">Aider</a> Polyglot Benchmarks Ran For Various Models
        </h2>
        <p className="header-info">
          This leaderboard includes models that don't appear on the official leaderboard, including smaller and lesser-known models.
          Join our <a href="https://discord.gg/cK9WeQ7jPq" target="_blank" className="discord-link">Discord</a> to chat or submit a model for benchmarking.
        </p>
        <p className="header-info">
          This leaderboard is open source. Check out the code on <a href="https://github.com/aj47/techfren-leaderboard" target="_blank" className="github-link">GitHub</a>.
        </p>
      </header>

      <main>
        <Leaderboard models={models} />
      </main>
    </div>
  );
}
