# @techfrens Coding LLM Benchmarks

An interactive leaderboard showcasing unofficial [Aider](https://aider.chat/docs/leaderboards/) polyglot benchmarks for various LLM models, including smaller and lesser-known models that don't appear on the official leaderboard.

![Matrix-inspired UI with green text on dark background](https://i.imgur.com/placeholder.png)

## 🚀 Features

- **Interactive Leaderboard**: Sort models by pass rate, speed, or cost
- **Detailed Model Information**: Click on any model to view comprehensive benchmark details
- **Matrix-inspired UI**: Featuring a digital rain animation background
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Displays the most recent benchmark results

## 📊 About the Benchmarks

This leaderboard displays results from running the [Aider polyglot benchmarks](https://aider.chat/docs/leaderboards/) on various LLM models. The benchmarks test the models' ability to understand and modify code across multiple programming languages.

Key metrics include:
- **Pass Rate**: Percentage of test cases the model successfully completed
- **Speed**: Performance measured in milliseconds per test case (lower is better)
- **Cost**: Total cost to run the benchmark on the model

## 🛠️ Setup and Installation

This is a static web application that can be run locally or deployed to any web server.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/aj47/techfren-leaderboard.git
   cd techfren-leaderboard
   ```

2. Open the project in your preferred code editor

3. Serve the files using any local web server. For example, with Python:
   ```bash
   # Python 3
   python -m http.server

   # Python 2
   python -m SimpleHTTPServer
   ```

4. Open your browser and navigate to `http://localhost:8000`

### Adding New Models

To add a new model to the leaderboard:

1. Run the Aider benchmark on your model
2. Add the model data to the `models.json` file following the existing format
3. The leaderboard will automatically update with the new data

## 💻 Technologies Used

- **Vue.js 3**: For reactive UI components
- **HTML5/CSS3**: For structure and styling
- **Canvas API**: For the digital rain animation
- **ES6 JavaScript**: For modern JavaScript functionality

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🌐 Community

Join our [Discord community](https://discord.gg/cK9WeQ7jPq) to chat about the project or submit a model for benchmarking.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Official Aider Leaderboard](https://aider.chat/docs/leaderboards/)
- [GitHub Repository](https://github.com/aj47/techfren-leaderboard)
- [Discord Community](https://discord.gg/cK9WeQ7jPq)
