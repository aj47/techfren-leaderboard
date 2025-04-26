'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis,
  LineChart, Line
} from 'recharts';
import { Model } from '../utils/yamlLoader';

interface ChartsProps {
  models: Model[];
}

export default function Charts({ models }: ChartsProps) {
  const [selectedChart, setSelectedChart] = useState<'passRate' | 'languages' | 'costEfficiency' | 'errorAnalysis'>('passRate');

  // Prepare data for pass rate chart
  const passRateData = models
    .filter((model, index, self) =>
      index === self.findIndex(m => m.id === model.id)
    )
    .map(model => ({
      name: `${model.name} (${model.id})`,
      passRate: model.passRate,
      firstPassRate: model.details.pass_rate_1,
      fill: model.passRate > 40 ? '#00ff00' : model.passRate > 20 ? '#88ff00' : '#ffff00'
    }))
    .sort((a, b) => b.passRate - a.passRate);

  // Prepare data for language comparison
  const getLanguageData = () => {
    // Get all models with language pass rates, sorted by overall pass rate
    const modelsWithLanguageData = [...models]
      .filter(model => model.details.language_pass_rates)
      .sort((a, b) => b.passRate - a.passRate)
      .filter((model, index, self) =>
        index === self.findIndex(m => m.id === model.id)
      );

    return modelsWithLanguageData.map(model => {
      const langRates = model.details.language_pass_rates || {};
      return {
        name: `${model.name} (${model.id})`, // Include ID to make names unique
        JavaScript: langRates.javascript_pass_rate_2 || 0,
        Python: langRates.python_pass_rate_2 || 0,
        Rust: langRates.rust_pass_rate_2 || 0,
        Go: langRates.go_pass_rate_2 || 0,
        CPP: langRates.cpp_pass_rate_2 || 0,
        Java: langRates.java_pass_rate_2 || 0,
      };
    });
  };

  // Prepare data for cost efficiency chart (scatter plot)
  const costEfficiencyData = models
    .filter((model, index, self) =>
      index === self.findIndex(m => m.id === model.id)
    )
    .sort((a, b) => b.passRate - a.passRate)
    .map(model => {
      // Calculate value score with protection against extreme values
      let valueScore = 0;

      if (model.cost <= 0) {
        // For free models, base value on pass rate
        valueScore = model.passRate * 10;
      } else if (model.cost > 1000) {
        // For extremely expensive models, cap the minimum value
        valueScore = Math.max(5, (model.passRate / 1000) * 5);
      } else {
        // Normal calculation for reasonably priced models
        valueScore = (model.passRate / model.cost) * 5;
      }

      // Ensure value score is within reasonable bounds (5-500)
      valueScore = Math.min(500, Math.max(5, valueScore));

      return {
        name: `${model.name} (ID: ${model.id})`,
        cost: model.cost,
        speed: model.speed / 1000, // Convert to seconds
        passRate: model.passRate,
        z: valueScore, // Use the calculated and bounded value score
        // Store original calculation for reference
        rawValueScore: model.cost > 0 ? (model.passRate / model.cost) : model.passRate,
      };
    });

  // Prepare data for error analysis
  const getErrorData = () => {
    // Get all models without limiting the number
    const uniqueModels = [...models]
      .filter((model, index, self) =>
        index === self.findIndex(m => m.id === model.id)
      )
      .sort((a, b) => b.passRate - a.passRate) // Sort by pass rate for better visualization
      .slice(0, 15); // Limit to 15 models to prevent overcrowding

    return uniqueModels.map(model => {
      // Ensure all values exist with defaults of 0 for missing data
      return {
        name: `${model.name} (${model.id})`,
        malformedResponses: model.details.num_malformed_responses || 0,
        errorOutputs: model.details.error_outputs || 0,
        userAsks: model.details.user_asks || 0,
        timeouts: model.details.test_timeouts || 0,
        // Store original values for tooltip display (same as actual values now)
        originalMalformed: model.details.num_malformed_responses || 0,
        originalErrors: model.details.error_outputs || 0,
        originalAsks: model.details.user_asks || 0,
        originalTimeouts: model.details.test_timeouts || 0,
      };
    });
  };

  // Calculate radar chart data for top models
  const getRadarData = () => {
    // Get unique models by ID, sorted by pass rate
    const uniqueModels = [...models]
      .sort((a, b) => b.passRate - a.passRate)
      .filter((model, index, self) =>
        index === self.findIndex(m => m.id === model.id)
      )
      .slice(0, 5); // Show top 5 models instead of 3

    // Find max values for normalization with protection against extreme values
    const speeds = models.map(m => m.speed);
    const costs = models.map(m => m.cost);
    const errors = models.map(m => m.details.error_outputs || 0);

    // Use 95th percentile instead of absolute max to handle outliers
    const maxSpeed = speeds.sort((a, b) => a - b)[Math.floor(speeds.length * 0.95)] || 1;

    // For cost, handle extreme values by capping at a reasonable maximum
    const reasonableCosts = costs.filter(cost => cost <= 1000);
    const maxCost = reasonableCosts.length > 0
      ? Math.max(...reasonableCosts)
      : Math.min(1000, Math.max(...costs, 1));

    const maxErrors = Math.max(...errors, 1); // Ensure non-zero

    return uniqueModels.map(model => {
      // Calculate normalized values with protection against extreme values
      const speedNormalized = Math.min(100, 100 - ((model.speed / maxSpeed) * 100));

      // For cost, handle free models and extreme costs
      let costEfficiency: number;
      if (model.cost <= 0) {
        costEfficiency = 100; // Free models get perfect score
      } else if (model.cost > maxCost) {
        costEfficiency = Math.max(10, 100 - ((maxCost / model.cost) * 100)); // Minimum 10% for readability
      } else {
        costEfficiency = 100 - ((model.cost / maxCost) * 100);
      }

      // Ensure well-formed percentage is valid
      const wellFormed = model.details.percent_cases_well_formed || 0;

      // Calculate error-free score
      const errorFree = Math.min(100, 100 - (((model.details.error_outputs || 0) / maxErrors) * 100));

      return {
        name: `${model.name} (${model.id})`, // Include ID to make names unique
        "Pass Rate": model.passRate,
        "Speed": speedNormalized, // Invert so faster is better (higher)
        "Cost Efficiency": costEfficiency, // Invert so cheaper is better (higher)
        "Well-formed": wellFormed,
        "Error-free": errorFree, // Invert so fewer errors is better
      };
    });
  };

  return (
    <div className="charts-container">
      <h2 className="charts-title">Performance Visualizations</h2>

      <div className="chart-controls">
        <button
          onClick={() => setSelectedChart('passRate')}
          className={selectedChart === 'passRate' ? 'active' : ''}
        >
          Pass Rates
        </button>
        <button
          onClick={() => setSelectedChart('languages')}
          className={selectedChart === 'languages' ? 'active' : ''}
        >
          Language Comparison
        </button>
        <button
          onClick={() => setSelectedChart('costEfficiency')}
          className={selectedChart === 'costEfficiency' ? 'active' : ''}
        >
          Cost vs. Performance
        </button>
        <button
          onClick={() => setSelectedChart('errorAnalysis')}
          className={selectedChart === 'errorAnalysis' ? 'active' : ''}
        >
          Error Analysis
        </button>
      </div>

      <div className="chart-container">
        {selectedChart === 'passRate' && (
          <>
            <h3>Pass Rates Comparison</h3>
            <div className="chart-description">
              Comparing overall pass rates and first-pass rates for top models.
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={passRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Overall Pass Rate") return [`${value}%`, name];
                    if (name === "First Pass Rate") return [`${value}%`, name];
                    return [`${value}%`, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const model = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <p className="label">{model.name}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: {entry.value}%
                            </p>
                          ))}
                          <p className="tooltip-note">
                            First Pass Rate: Success without feedback<br/>
                            Overall Pass Rate: Success with feedback
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="passRate" name="Overall Pass Rate" fill="#00ff00" />
                <Bar dataKey="firstPassRate" name="First Pass Rate" fill="#00cccc" />
              </BarChart>
            </ResponsiveContainer>

            <div className="chart-insights">
              <h4>Key Insights:</h4>
              <ul>
                <li>First Pass Rate: Success rate on the first attempt (without feedback)</li>
                <li>Overall Pass Rate: Success rate after multiple attempts (with feedback)</li>
                <li>Models with higher overall pass rates tend to have better first-pass rates</li>
                <li>The gap between first-pass and overall rates shows how well models improve with feedback</li>
              </ul>
            </div>
          </>
        )}

        {selectedChart === 'languages' && (
          <>
            <h3>Language-Specific Performance</h3>
            <div className="chart-description">
              How top models perform across different programming languages.
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart outerRadius={150} data={getRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={getRadarData()[0]?.name || "Model 1"}
                  dataKey="Pass Rate"
                  stroke="#00ff00"
                  fill="#00ff00"
                  fillOpacity={0.3}
                />
                <Radar
                  name={getRadarData()[1]?.name || "Model 2"}
                  dataKey="Pass Rate"
                  stroke="#00ccff"
                  fill="#00ccff"
                  fillOpacity={0.3}
                />
                <Radar
                  name={getRadarData()[2]?.name || "Model 3"}
                  dataKey="Pass Rate"
                  stroke="#ff00ff"
                  fill="#ff00ff"
                  fillOpacity={0.3}
                />
                <Radar
                  name={getRadarData()[3]?.name || "Model 4"}
                  dataKey="Pass Rate"
                  stroke="#ffcc00"
                  fill="#ffcc00"
                  fillOpacity={0.3}
                />
                <Radar
                  name={getRadarData()[4]?.name || "Model 5"}
                  dataKey="Pass Rate"
                  stroke="#ff6600"
                  fill="#ff6600"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={getLanguageData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Pass Rate']} />
                <Legend />
                <Bar dataKey="JavaScript" fill="#f7df1e" />
                <Bar dataKey="Python" fill="#3776ab" />
                <Bar dataKey="Rust" fill="#dea584" />
                <Bar dataKey="Go" fill="#00add8" />
                <Bar dataKey="CPP" fill="#f34b7d" />
                <Bar dataKey="Java" fill="#b07219" />
              </BarChart>
            </ResponsiveContainer>

            <div className="chart-insights">
              <h4>Key Insights:</h4>
              <ul>
                <li>Some models excel at specific languages while struggling with others</li>
                <li>JavaScript and Python tend to have higher pass rates across most models</li>
              </ul>
            </div>
          </>
        )}

        {selectedChart === 'costEfficiency' && (
          <>
            <h3>Cost vs. Performance Analysis</h3>
            <div className="chart-description">
              Visualizing the relationship between cost, speed, and pass rate.
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="speed"
                  name="Speed"
                  unit="s"
                  domain={[0, 'dataMax']}
                  label={{ value: 'Speed (s)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="passRate"
                  name="Pass Rate"
                  unit="%"
                  domain={[0, 60]}
                  label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[100, 800]}
                  name="Value Score"
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => {
                    if (name === 'Pass Rate') return [`${value}%`, name];
                    if (name === 'Speed') return [`${value}s`, name];
                    if (name === 'Cost') return [`$${value}`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const model = payload[0].payload;
                      // Format cost with appropriate precision based on magnitude
                      const formattedCost = model.cost > 1000
                        ? model.cost.toLocaleString()
                        : model.cost.toFixed(model.cost > 100 ? 0 : 4);

                      // Format value score explanation
                      let valueExplanation = "";
                      if (model.cost <= 0) {
                        valueExplanation = "(Free model bonus)";
                      } else if (model.cost > 1000) {
                        valueExplanation = "(High cost adjustment applied)";
                      }

                      return (
                        <div className="custom-tooltip">
                          <p className="label">{model.name}</p>
                          <p>Pass Rate: {model.passRate}%</p>
                          <p>Cost: ${formattedCost}</p>
                          <p>Speed: {model.speed.toFixed(1)}s</p>
                          <p>Value Score: {model.z.toFixed(1)} {valueExplanation}</p>
                          <p className="tooltip-note">
                            {model.cost > 0
                              ? `Raw Value (Pass Rate/Cost): ${model.rawValueScore.toFixed(4)}`
                              : "Free models receive a bonus to highlight their value"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter
                  name="Models"
                  data={costEfficiencyData}
                  fill="#00ff00"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>

            <div className="chart-insights">
              <h4>Key Insights:</h4>
              <ul>
                <li>Bubble size represents value (higher pass rate relative to cost)</li>
                <li>The top-left quadrant shows high-performing and fast models</li>
                <li>Models further to the right take longer to process each test case</li>
                <li>Free models (cost=$0) have larger bubbles to highlight their value</li>
                <li>For extremely high-cost models, value scores are adjusted to maintain chart readability</li>
              </ul>
            </div>
          </>
        )}

        {selectedChart === 'errorAnalysis' && (
          <>
            <h3>Error Analysis</h3>
            <div className="chart-description">
              Comparing different types of errors across models.
            </div>
            <ResponsiveContainer width="100%" height={600}>
              <BarChart
                data={getErrorData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                layout="vertical"
                barSize={15}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 'dataMax']}
                  label={{ value: 'Number of Occurrences', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={200}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    const payload = props.payload;
                    // Display the actual value or 0 if undefined
                    if (name === "Malformed Responses") {
                      return [payload.malformedResponses || 0, name];
                    } else if (name === "Error Outputs") {
                      return [payload.errorOutputs || 0, name];
                    } else if (name === "User Asks") {
                      return [payload.userAsks || 0, name];
                    } else if (name === "Timeouts") {
                      return [payload.timeouts || 0, name];
                    }
                    return [value || 0, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip">
                          <p className="label">{payload[0]?.payload?.name}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: {entry.value || 0}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="malformedResponses" name="Malformed Responses" fill="#ff0000" />
                <Bar dataKey="errorOutputs" name="Error Outputs" fill="#ff9900" />
                <Bar dataKey="userAsks" name="User Asks" fill="#ffff00" />
                <Bar dataKey="timeouts" name="Timeouts" fill="#ff00ff" />
              </BarChart>
            </ResponsiveContainer>

            <div className="chart-insights">
              <h4>Key Insights:</h4>
              <ul>
                <li>Models with fewer malformed responses tend to have higher pass rates</li>
                <li>User asks indicate how often the model needed clarification</li>
                <li>Timeouts can indicate performance issues with complex tasks</li>
                <li>Error outputs show how often the model produced invalid code or responses</li>
                <li>Missing bars indicate zero occurrences of that error type</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
