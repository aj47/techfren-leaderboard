'use client';

import { useState, useEffect, useMemo } from 'react';
import { Model } from '../utils/yamlLoader';
import ModelDetailModal from './ModelDetailModal';

interface LeaderboardProps {
  models: Model[];
}

export default function Leaderboard({ models }: LeaderboardProps) {
  console.log('Leaderboard component rendering with models:', models);
  const [sortColumn, setSortColumn] = useState<'passRate' | 'speed' | 'cost' | 'secondsPerCorrect'>('passRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [modelTypeFilter, setModelTypeFilter] = useState<'all' | 'opensource' | 'proprietary'>('all');

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

  const sortBy = (column: 'passRate' | 'speed' | 'cost' | 'secondsPerCorrect', language?: string | null) => {
    if (sortColumn === column && selectedLanguage === language) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSelectedLanguage(language);
      // For secondsPerCorrect and speed, default to ascending (lower is better)
      setSortDirection(column === 'secondsPerCorrect' || column === 'speed' ? 'asc' : 'desc');
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
    // Filter by model type
    let filteredModels = models;
    if (modelTypeFilter === 'opensource') {
      filteredModels = models.filter(model => model.details.isOpenSource === true);
    } else if (modelTypeFilter === 'proprietary') {
      filteredModels = models.filter(model => model.details.isOpenSource === false || model.details.isOpenSource === undefined);
    }
    
    return [...filteredModels].sort((a, b) => {
      let comparison = 0;

      // If sorting by pass rate and a language is selected
      if (sortColumn === 'passRate' && selectedLanguage) {
        const languageKey = `${selectedLanguage.toLowerCase()}_pass_rate_2` as keyof typeof a.details.language_pass_rates;

        const aValue = a.details.language_pass_rates?.[languageKey] ?? 0;
        const bValue = b.details.language_pass_rates?.[languageKey] ?? 0;

        if (aValue < bValue) {
          comparison = -1;
        } else if (aValue > bValue) {
          comparison = 1;
        }
      } else if (sortColumn === 'secondsPerCorrect') {
        // Calculate seconds per correct case for each model
        const aSecondsPerCorrect = a.details.pass_num_2 > 0 
          ? (a.details.seconds_per_case * a.details.total_tests) / a.details.pass_num_2
          : Infinity; // Models with no passes sort to the end
        const bSecondsPerCorrect = b.details.pass_num_2 > 0 
          ? (b.details.seconds_per_case * b.details.total_tests) / b.details.pass_num_2
          : Infinity;
        
        if (aSecondsPerCorrect < bSecondsPerCorrect) {
          comparison = -1;
        } else if (aSecondsPerCorrect > bSecondsPerCorrect) {
          comparison = 1;
        }
      } else {
        // Default sorting for passRate, speed, cost
        if (a[sortColumn] < b[sortColumn]) {
          comparison = -1;
        } else if (a[sortColumn] > b[sortColumn]) {
          comparison = 1;
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [models, sortColumn, sortDirection, selectedLanguage, modelTypeFilter]);

  useEffect(() => {
    // Update progress text colors after render
    const updateProgressTextColors = () => {
      // Process both regular progress bars and speed progress bars
      const allProgressBars = document.querySelectorAll('.progress-bar, .speed-progress-bar');

      allProgressBars.forEach(bar => {
        // Determine which progress class to look for based on the bar's class
        const progressClass = bar.classList.contains('progress-bar') ? '.progress' : '.speed-progress';
        const progressElement = bar.querySelector(progressClass) as HTMLElement;
        const textElement = bar.querySelector('.progress-text') as HTMLElement;

        if (!progressElement || !textElement) return;

        // Skip the rest of the calculations since text color is now handled by CSS
        // This avoids potential errors with elements that might not exist
      });
    };

    // Setup tooltip functionality
    const setupTooltip = () => {
      const speedHeader = document.querySelector('th.speed .tooltip-container');
      const speedTooltip = document.getElementById('speed-tooltip');
      const tooltipOverlay = document.getElementById('tooltip-overlay');

      if (!speedHeader || !speedTooltip || !tooltipOverlay) return;

      // Function to position tooltip properly
      const positionTooltip = (rect: DOMRect) => {
        // Position the tooltip above the header
        const isMobile = window.innerWidth <= 768;

        // For mobile, position at top of screen to ensure visibility
        if (isMobile) {
          (speedTooltip as HTMLElement).style.top = '50px';
        } else {
          (speedTooltip as HTMLElement).style.top = (rect.top - 10) + 'px';
        }

        // Show the tooltip
        (speedTooltip as HTMLElement).style.visibility = 'visible';
        (speedTooltip as HTMLElement).style.opacity = '1';
      };

      // Show tooltip on hover for desktop
      speedHeader.addEventListener('mouseenter', () => {
        // Don't prevent default to allow the click for sorting
        const rect = (speedHeader as HTMLElement).getBoundingClientRect();
        positionTooltip(rect);
      });

      // Hide tooltip when mouse leaves
      speedHeader.addEventListener('mouseleave', () => {
        (speedTooltip as HTMLElement).style.visibility = 'hidden';
        (speedTooltip as HTMLElement).style.opacity = '0';
      });

      // For mobile: show on tap, but don't interfere with sorting
      speedHeader.addEventListener('touchstart', () => {
        // Don't prevent default to allow the click for sorting
        const rect = (speedHeader as HTMLElement).getBoundingClientRect();
        positionTooltip(rect);

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
  }, [sortedModels, viewMode]);

  return (
    <>
      <div id="tooltip-overlay" className="tooltip-overlay">
        <div id="speed-tooltip" className="global-tooltip">
          Speed in seconds per test case. Lower is better.
        </div>
      </div>

      {showDetailModal && selectedModel && (
        <ModelDetailModal model={selectedModel} onClose={closeDetailModal} />
      )}

      <div className="controls-container">
        <div className="view-toggle-container">
          <button
            className={`view-toggle-button ${viewMode === 'simple' ? 'active' : ''}`}
            onClick={() => setViewMode('simple')}
          >
            Simple View
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setViewMode('detailed')}
          >
            Detailed View
          </button>
        </div>

        <div className="language-dropdown-container">
          <div className="language-dropdown">
            <button className="language-dropdown-button">
              Language: {selectedLanguage || 'All Languages'}
            </button>
            <div className="language-dropdown-content">
              <button onClick={() => sortBy('passRate', null)}
                className={selectedLanguage === null ? 'active' : ''}>
                All Languages {sortColumn === 'passRate' && selectedLanguage === null ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
              <button onClick={() => sortBy('passRate', 'JavaScript')}
                className={selectedLanguage === 'JavaScript' ? 'active' : ''}>
                JavaScript {sortColumn === 'passRate' && selectedLanguage === 'JavaScript' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
              <button onClick={() => sortBy('passRate', 'Python')}
                className={selectedLanguage === 'Python' ? 'active' : ''}>
                Python {sortColumn === 'passRate' && selectedLanguage === 'Python' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
              <button onClick={() => sortBy('passRate', 'Java')}
                className={selectedLanguage === 'Java' ? 'active' : ''}>
                Java {sortColumn === 'passRate' && selectedLanguage === 'Java' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
              <button onClick={() => sortBy('passRate', 'Cpp')}
                className={selectedLanguage === 'Cpp' ? 'active' : ''}>
                C++ {sortColumn === 'passRate' && selectedLanguage === 'Cpp' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
              <button onClick={() => sortBy('passRate', 'Go')}
                className={selectedLanguage === 'Go' ? 'active' : ''}>
                Go {sortColumn === 'passRate' && selectedLanguage === 'Go' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
              <button onClick={() => sortBy('passRate', 'Rust')}
                className={selectedLanguage === 'Rust' ? 'active' : ''}>
                Rust {sortColumn === 'passRate' && selectedLanguage === 'Rust' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </button>
            </div>
          </div>
          
          <div className="model-type-dropdown">
            <button className="model-type-dropdown-button">
              Show: {modelTypeFilter === 'all' ? 'All' : modelTypeFilter === 'opensource' ? 'Open Source' : 'Proprietary'}
            </button>
            <div className="model-type-dropdown-content">
              <button 
                onClick={() => setModelTypeFilter('all')}
                className={modelTypeFilter === 'all' ? 'active' : ''}
              >
                All
              </button>
              <button 
                onClick={() => setModelTypeFilter('opensource')}
                className={modelTypeFilter === 'opensource' ? 'active' : ''}
              >
                Open Source
              </button>
              <button 
                onClick={() => setModelTypeFilter('proprietary')}
                className={modelTypeFilter === 'proprietary' ? 'active' : ''}
              >
                Proprietary
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="helper-text">
        Toggle between simple and detailed views. Click on column headers to sort. Click on a row to see full details.
      </div>

      <div className="leaderboard-container">
        <table className={`leaderboard ${viewMode === 'detailed' ? 'detailed-view' : 'simple-view'}`}>
          <thead>
            <tr>
              <th className="rank">Rank</th>
              <th className="model">Model</th>
              <th
                className={`passRate sortable ${sortColumn === 'passRate' ? 'active' : ''}`}
                onClick={() => sortBy('passRate', selectedLanguage)}
              >
                Pass Rate {selectedLanguage ? `(${selectedLanguage})` : ''}
                {sortColumn === 'passRate' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                className={`speed sortable ${sortColumn === 'speed' ? 'active' : ''}`}
                onClick={() => sortBy('speed', selectedLanguage)}
              >
                <span className="tooltip-container">
                  Speed per Case
                  {sortColumn === 'speed' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
              <th
                className={`cost sortable ${sortColumn === 'cost' ? 'active' : ''}`}
                onClick={() => sortBy('cost', selectedLanguage)}
              >
                Cost
                {sortColumn === 'cost' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>

              {viewMode === 'detailed' && (
                <>
                  <th
                    className={`seconds-per-correct sortable ${sortColumn === 'secondsPerCorrect' ? 'active' : ''}`}
                    onClick={() => sortBy('secondsPerCorrect', selectedLanguage)}
                  >
                    Seconds per Correct Case
                    {sortColumn === 'secondsPerCorrect' && (
                      <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="pass-rate-first">Pass Rate (First)</th>
                  <th className="date">Date</th>
                  <th className="error-outputs">Error Outputs</th>
                  <th className="timeouts">Timeouts</th>
                  <th className="malformed">Malformed</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model, index) => (
              <tr
                key={model.id}
                className={`clickable-row ${index < 3 ? 'highlight-row' : ''}`}
                onClick={() => showDetails(model)}
              >
                <td className="rank">
                  <span className="cell-content">{index + 1}</span>
                </td>
                <td className="model">
                  <span className="cell-content">
                    {model.name}
                    {viewMode === 'detailed' && (
                      <>
                        {model.details.edit_format === "architect" && (
                          <span className="architect-badge model-badge" data-tooltip="Architect mode with editor model">A</span>
                        )}
                        {model.details.edit_format === "whole" && (
                          <span className="whole-badge model-badge" data-tooltip="Whole format mode">W</span>
                        )}
                        {model.details.edit_format === "diff" && (
                          <span className="diff-badge model-badge" data-tooltip="Diff format mode">D</span>
                        )}
                        {model.details.reasoning_effort && (
                          <span
                            className={`reasoning-badge reasoning-${model.details.reasoning_effort.toLowerCase()} model-badge`}
                            data-tooltip={`Reasoning effort: ${model.details.reasoning_effort}`}
                          >
                            R
                          </span>
                        )}
                        {model.details.isOpenSource !== undefined && (
                          <span
                            className={`opensource-badge ${model.details.isOpenSource ? 'opensource-true' : 'opensource-false'} model-badge`}
                            data-tooltip={model.details.isOpenSource ? 'Open Source Model' : 'Proprietary Model'}
                          >
                            {model.details.isOpenSource ? 'OS' : 'P'}
                          </span>
                        )}
                        {model.details.sponsor && (
                          <span
                            className="sponsor-badge model-badge"
                            data-tooltip={`Sponsored by: ${model.details.sponsor}`}
                          >
                            S
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </td>
                <td className="passRate">
                  <div className="progress-bar">
                    {selectedLanguage ? (
                      <>
                        <div
                          className="progress"
                          style={{
                            width: `${model.details.language_pass_rates?.[`${selectedLanguage.toLowerCase()}_pass_rate_2` as keyof typeof model.details.language_pass_rates] || 0}%`
                          }}
                        ></div>
                        <span className="progress-text">
                          {model.details.language_pass_rates?.[`${selectedLanguage.toLowerCase()}_pass_rate_2` as keyof typeof model.details.language_pass_rates] || 0}%
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="progress" style={{ width: `${model.passRate}%` }}></div>
                        <span className="progress-text">{model.passRate}%</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="speed">
                  <div className="speed-progress-bar">
                    <span className="progress-text">{(model.speed / 1000).toFixed(1)}s</span>
                  </div>
                </td>
                <td className="cost">
                  <span className="cell-content">${model.cost.toFixed(3)}</span>
                </td>

                {viewMode === 'detailed' && (
                  <>
                    <td className="seconds-per-correct">
                      <span className="cell-content">
                        {model.details.pass_num_2 > 0 
                          ? `${((model.details.seconds_per_case * model.details.total_tests) / model.details.pass_num_2).toFixed(1)}s`
                          : 'N/A'
                        }
                      </span>
                    </td>
                    <td className="pass-rate-first">
                      <span className="cell-content">{model.details.pass_rate_1}%</span>
                    </td>
                    <td className="date">
                      <span className="cell-content">{model.details.date}</span>
                    </td>
                    <td className="error-outputs">
                      <span className="cell-content">{model.details.error_outputs}</span>
                    </td>
                    <td className="timeouts">
                      <span className="cell-content">{model.details.test_timeouts}</span>
                    </td>
                    <td className="malformed">
                      <span className="cell-content">{model.details.num_malformed_responses}</span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer>
        <p>Last benchmark added: {currentDate}</p>
        <div className="sponsor-container">
          <a href="https://buymeacoffee.com/techfren/e/403261" target="_blank" className="sponsor-button">
            Sponsor
          </a>
          <span className="sponsor-info">Sponsor a benchmark for a model of your choice".</span>
          <span className="sponsor-info">Note: Sponsored models must have an API with sufficient rate limits.</span>
        </div>
      </footer>
    </>
  );
}
