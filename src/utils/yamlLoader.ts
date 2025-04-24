import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface LanguagePassRates {
  cpp_pass_rate_1?: number;
  cpp_pass_rate_2?: number;
  go_pass_rate_1?: number;
  go_pass_rate_2?: number;
  java_pass_rate_1?: number;
  java_pass_rate_2?: number;
  javascript_pass_rate_1?: number;
  javascript_pass_rate_2?: number;
  python_pass_rate_1?: number;
  python_pass_rate_2?: number;
  rust_pass_rate_1?: number;
  rust_pass_rate_2?: number;
}

export interface ModelDetails {
  dirname: string;
  test_cases: number;
  model: string;
  edit_format: string;
  commit_hash: string;
  language?: string;
  pass_rate_1: number;
  pass_rate_2: number;
  pass_num_1: number;
  pass_num_2: number;
  percent_cases_well_formed: number;
  error_outputs: number;
  num_malformed_responses: number;
  num_with_malformed_responses: number;
  user_asks: number;
  lazy_comments: number;
  syntax_errors: number;
  indentation_errors: number;
  exhausted_context_windows: number;
  test_timeouts: number;
  total_tests: number;
  command: string;
  date: string;
  versions: string;
  seconds_per_case: number;
  total_cost: number;

  // New fields for DeepSeek model
  total_api_calls?: number;
  total_retries?: number;
  avg_api_calls_per_test?: number;
  avg_retries_per_test?: number;
  retry_rate_percent?: number;
  language_pass_rates?: LanguagePassRates;
}

export interface Model {
  id: number;
  name: string;
  passRate: number;
  speed: number;
  cost: number;
  details: ModelDetails;
}

export function loadModels(): Model[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'models.yaml');
    console.log('Loading YAML from path:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('YAML file contents loaded, length:', fileContents.length);
    const models = yaml.load(fileContents) as Model[];
    console.log('Parsed models:', models);
    return models;
  } catch (error) {
    console.error('Error loading models:', error);
    return [];
  }
}
