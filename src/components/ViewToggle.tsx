'use client';

import { useState } from 'react';
import Leaderboard from './Leaderboard';
import Charts from './Charts';
import { Model } from '../utils/yamlLoader';

interface ViewToggleProps {
  models: Model[];
}

export default function ViewToggle({ models }: ViewToggleProps) {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <>
      <div className="view-toggle-container">
        <div className="toggle-button-container">
          <button 
            className={`toggle-button ${!showCharts ? 'active' : ''}`}
            onClick={() => setShowCharts(false)}
          >
            Leaderboard
          </button>
          <button 
            className={`toggle-button ${showCharts ? 'active' : ''}`}
            onClick={() => setShowCharts(true)}
          >
            Charts
          </button>
        </div>
      </div>
      
      {showCharts ? (
        <Charts models={models} />
      ) : (
        <Leaderboard models={models} />
      )}
    </>
  );
}
