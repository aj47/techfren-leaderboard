'use client';

import { useEffect, useRef } from 'react';
import { Model } from '../utils/yamlLoader';

interface ModelDetailModalProps {
  model: Model;
  onClose: () => void;
}

export default function ModelDetailModal({ model, onClose }: ModelDetailModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== 'detail-modal'
      ) {
        onClose();
      }
    };

    // Add event listener after a short delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div id="detail-modal" className="modal">
      <div className="modal-content" ref={modalContentRef}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{model.name} Details</h2>
        <div className="detail-grid">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-item">
              <span className="detail-label">Model:</span>
              <span className="detail-value">{model.details.model}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Edit Format:</span>
              <span className="detail-value">{model.details.edit_format}</span>
            </div>
            {model.details.editor_model && (
              <div className="detail-item">
                <span className="detail-label">Editor Model:</span>
                <span className="detail-value">{model.details.editor_model}</span>
              </div>
            )}
            {model.details.editor_edit_format && (
              <div className="detail-item">
                <span className="detail-label">Editor Edit Format:</span>
                <span className="detail-value">{model.details.editor_edit_format}</span>
              </div>
            )}
            {model.details.reasoning_effort && (
              <div className="detail-item">
                <span className="detail-label">Reasoning Effort:</span>
                <span className="detail-value">{model.details.reasoning_effort}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{model.details.date}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Command:</span>
              <span className="detail-value">{model.details.command}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Version:</span>
              <span className="detail-value">{model.details.versions}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Commit Hash:</span>
              <span className="detail-value">{model.details.commit_hash}</span>
            </div>
            {model.details.language && (
              <div className="detail-item">
                <span className="detail-label">Languages:</span>
                <span className="detail-value">{model.details.language}</span>
              </div>
            )}
          </div>
          <div className="detail-section">
            <h3>Performance Metrics</h3>
            <div className="detail-item">
              <span className="detail-label">Pass Rate:</span>
              <span className="detail-value">{model.details.pass_rate_2}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">First Pass Rate:</span>
              <span className="detail-value">{model.details.pass_rate_1}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Passes:</span>
              <span className="detail-value">{model.details.pass_num_2} / {model.details.total_tests}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">First Passes:</span>
              <span className="detail-value">{model.details.pass_num_1} / {model.details.total_tests}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Well-formed Responses:</span>
              <span className="detail-value">{model.details.percent_cases_well_formed}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Speed:</span>
              <span className="detail-value">{model.details.seconds_per_case} seconds per case</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Cost:</span>
              <span className="detail-value">${model.details.total_cost}</span>
            </div>
            {model.details.total_api_calls !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Total API Calls:</span>
                <span className="detail-value">{model.details.total_api_calls}</span>
              </div>
            )}
            {model.details.avg_api_calls_per_test !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Avg API Calls Per Test:</span>
                <span className="detail-value">{model.details.avg_api_calls_per_test}</span>
              </div>
            )}
            {model.details.total_retries !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Total Retries:</span>
                <span className="detail-value">{model.details.total_retries}</span>
              </div>
            )}
            {model.details.avg_retries_per_test !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Avg Retries Per Test:</span>
                <span className="detail-value">{model.details.avg_retries_per_test}</span>
              </div>
            )}
            {model.details.retry_rate_percent !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Retry Rate:</span>
                <span className="detail-value">{model.details.retry_rate_percent}%</span>
              </div>
            )}
          </div>
          <div className="detail-section">
            <h3>Error Analysis</h3>
            <div className="detail-item">
              <span className="detail-label">Error Outputs:</span>
              <span className="detail-value">{model.details.error_outputs}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Malformed Responses:</span>
              <span className="detail-value">{model.details.num_malformed_responses}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cases with Malformed Responses:</span>
              <span className="detail-value">{model.details.num_with_malformed_responses}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">User Asks:</span>
              <span className="detail-value">{model.details.user_asks}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Lazy Comments:</span>
              <span className="detail-value">{model.details.lazy_comments}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Syntax Errors:</span>
              <span className="detail-value">{model.details.syntax_errors}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Indentation Errors:</span>
              <span className="detail-value">{model.details.indentation_errors}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Exhausted Context Windows:</span>
              <span className="detail-value">{model.details.exhausted_context_windows}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Test Timeouts:</span>
              <span className="detail-value">{model.details.test_timeouts}</span>
            </div>
          </div>
          {model.details.language_pass_rates && (
            <div className="detail-section">
              <h3>Language-Specific Pass Rates</h3>
              {model.details.language_pass_rates.cpp_pass_rate_2 !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">C++:</span>
                  <span className="detail-value">{model.details.language_pass_rates.cpp_pass_rate_2}%</span>
                </div>
              )}
              {model.details.language_pass_rates.javascript_pass_rate_2 !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">JavaScript:</span>
                  <span className="detail-value">{model.details.language_pass_rates.javascript_pass_rate_2}%</span>
                </div>
              )}
              {model.details.language_pass_rates.python_pass_rate_2 !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Python:</span>
                  <span className="detail-value">{model.details.language_pass_rates.python_pass_rate_2}%</span>
                </div>
              )}
              {model.details.language_pass_rates.java_pass_rate_2 !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Java:</span>
                  <span className="detail-value">{model.details.language_pass_rates.java_pass_rate_2}%</span>
                </div>
              )}
              {model.details.language_pass_rates.go_pass_rate_2 !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Go:</span>
                  <span className="detail-value">{model.details.language_pass_rates.go_pass_rate_2}%</span>
                </div>
              )}
              {model.details.language_pass_rates.rust_pass_rate_2 !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Rust:</span>
                  <span className="detail-value">{model.details.language_pass_rates.rust_pass_rate_2}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
