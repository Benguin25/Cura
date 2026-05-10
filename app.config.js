const fs = require('fs');
const path = require('path');

function loadDotenv() {
  const envFile = path.join(__dirname, '.env');
  if (!fs.existsSync(envFile)) {
    return;
  }

  const contents = fs.readFileSync(envFile, 'utf8');
  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex < 0) {
      return;
    }
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadDotenv();

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    geminiApiKey:
      process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  },
});
