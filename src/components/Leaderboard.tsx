'use client';

import { useState, useEffect, useMemo } from 'react';
import { Model } from '../utils/yamlLoader';
import ModelDetailModal from './ModelDetailModal';

interface LeaderboardProps {
  models: Model[];
}

export default function Leaderboard({ models }: LeaderboardProps) {
  console.log('Leaderboard component rendering with models:', models);
  const [sortColumn, setSortColumn] = useState<'passRate' | 'speed' | 'cost'>('passRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Get the most recent date from model entries
    if (models.length > 0) {
      const dates = models
        .map(model => {
          const dateStr = model.details.date;
          return dateStr ? new Date(dateStr) : null;
        })
        .filter((date): date is Date => date !== null);

      if (dates.length > 0) {
        const mostRecentDate = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
        setCurrentDate(
          mostRecentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        );
      }
    }
  }, [models]);

  const sortBy = (column: 'passRate' | 'speed' | 'cost') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const showDetails = (model: Model) => {
    setSelectedModel(model);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      let comparison = 0;

      if (a[sortColumn] < b[sortColumn]) {
        comparison = -1;
      } else if (a[sortColumn] > b[sortColumn]) {
        comparison = 1;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [models, sortColumn, sortDirection]);

  useEffect(() => {
    // Update progress text colors after render
    const updateProgressTextColors = () => {
      const progressBars = document.querySelectorAll('.progress-bar');

      progressBars.forEach(bar => {
        const progressElement = bar.querySelector('.progress') as HTMLElement;
        const textElement = bar.querySelector('.progress-text') as HTMLElement;

        if (!progressElement || !textElement) return;

        const progressWidth = parseFloat(progressElement.style.width);
        const barWidth = (bar as HTMLElement).offsetWidth;
        const textWidth = textElement.offsetWidth;

        // Calculate the center position of the text
        const textCenter = barWidth / 2;

        // Calculate the right edge of the progress bar
        const progressRightEdge = (progressWidth / 100) * barWidth;

        // Determine if the text is mostly over the colored part of the progress bar
        const textLeftEdge = textCenter - (textWidth / 2);
        const textRightEdge = textCenter + (textWidth / 2);

        // Calculate how much of the text is over the colored part
        const overlapStart = Math.max(textLeftEdge, 0);
        const overlapEnd = Math.min(textRightEdge, progressRightEdge);
        const overlapWidth = Math.max(0, overlapEnd - overlapStart);

        // If more than 50% of the text is over the colored part, use dark text
        if (overlapWidth > textWidth / 2) {
          textElement.style.color = '#0a0a0a'; // Dark text (same as background)
        } else {
          textElement.style.color = '#e0e0e0'; // Light text (same as text color)
        }
      });
    };

    // Setup tooltip functionality
    const setupTooltip = () => {
      const speedHeader = document.querySelector('th.speed .tooltip-container');
      const speedTooltip = document.getElementById('speed-tooltip');
      const tooltipOverlay = document.getElementById('tooltip-overlay');

      if (!speedHeader || !speedTooltip || !tooltipOverlay) return;

      // Show tooltip on hover
      speedHeader.addEventListener('mouseenter', () => {
        const rect = (speedHeader as HTMLElement).getBoundingClientRect();

        // Position the tooltip above the header
        (speedTooltip as HTMLElement).style.left = (rect.left + rect.width / 2) + 'px';
        (speedTooltip as HTMLElement).style.top = (rect.top - 10) + 'px';

        // Show the tooltip
        (speedTooltip as HTMLElement).style.visibility = 'visible';
        (speedTooltip as HTMLElement).style.opacity = '1';
      });

      // Hide tooltip when mouse leaves
      speedHeader.addEventListener('mouseleave', () => {
        (speedTooltip as HTMLElement).style.visibility = 'hidden';
        (speedTooltip as HTMLElement).style.opacity = '0';
      });

      // For mobile: show on tap
      speedHeader.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = (speedHeader as HTMLElement).getBoundingClientRect();

        // Position the tooltip above the header
        (speedTooltip as HTMLElement).style.left = (rect.left + rect.width / 2) + 'px';
        (speedTooltip as HTMLElement).style.top = (rect.top - 10) + 'px';

        // Show the tooltip
        (speedTooltip as HTMLElement).style.visibility = 'visible';
        (speedTooltip as HTMLElement).style.opacity = '1';

        // Hide after 3 seconds
        setTimeout(() => {
          (speedTooltip as HTMLElement).style.visibility = 'hidden';
          (speedTooltip as HTMLElement).style.opacity = '0';
        }, 3000);
      });
    };

    // Call these functions after the component renders
    setTimeout(() => {
      updateProgressTextColors();
      setupTooltip();
    }, 100);

    // Update colors whenever the window is resized
    window.addEventListener('resize', updateProgressTextColors);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateProgressTextColors);
    };
  }, [sortedModels]);

  return (
    <>
      <div id="tooltip-overlay" className="tooltip-overlay">
        <div id="speed-tooltip" className="global-tooltip">
          Speed is measured in milliseconds per test case. Lower values indicate faster performance.
        </div>
      </div>

      {showDetailModal && selectedModel && (
        <ModelDetailModal model={selectedModel} onClose={closeDetailModal} />
      )}

      <div className="controls">
        <button
          onClick={() => sortBy('passRate')}
          className={sortColumn === 'passRate' ? 'active' : ''}
        >
          Sort by Pass Rate {sortColumn === 'passRate' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button
          onClick={() => sortBy('speed')}
          className={sortColumn === 'speed' ? 'active' : ''}
        >
          Sort by Speed {sortColumn === 'speed' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button
          onClick={() => sortBy('cost')}
          className={sortColumn === 'cost' ? 'active' : ''}
        >
          Sort by Cost {sortColumn === 'cost' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      <div className="leaderboard-container">
        <table className="leaderboard">
          <thead>
            <tr>
              <th className="rank">Rank</th>
              <th className="model">Model</th>
              <th className="passRate">Pass Rate</th>
              <th className="speed">
                <span className="tooltip-container">Speed</span>
              </th>
              <th className="cost">Cost</th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model, index) => (
              <tr
                key={model.id}
                className={`clickable-row ${index < 3 ? 'highlight-row' : ''}`}
                onClick={() => showDetails(model)}
              >
                <td className="rank">{index + 1}</td>
                <td className="model">{model.name}</td>
                <td className="passRate">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${model.passRate}%` }}></div>
                    <span className="progress-text">{model.passRate}%</span>
                  </div>
                </td>
                <td className="speed">{model.speed} ms</td>
                <td className="cost">${model.cost.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer>
        <p>Last benchmark added: {currentDate}</p>
      </footer>
    </>
  );
}
