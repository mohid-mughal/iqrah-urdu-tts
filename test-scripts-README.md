# Test Scripts

These scripts help test the Groq API integration for translation features.

## Setup

Before running these scripts, set your Groq API key as an environment variable:

### Windows (PowerShell)
```powershell
$env:GROQ_API_KEY="your_groq_api_key_here"
```

### Windows (CMD)
```cmd
set GROQ_API_KEY=your_groq_api_key_here
```

### Linux/Mac
```bash
export GROQ_API_KEY="your_groq_api_key_here"
```

## Available Scripts

### test-groq-api.js
Quick test to verify Groq API connectivity with multiple models.

```bash
node test-groq-api.js
```

### test-groq-models.js
Tests which Groq models are available with your API key.

```bash
node test-groq-models.js
```

### test-translation.js
Tests translation functionality with different models and test cases.

```bash
node test-translation.js
```

### test-final-translation.js
Final comprehensive test with the qwen/qwen3-32b model.

```bash
node test-final-translation.js
```

## Security Note

**Never commit your actual API key to the repository!** Always use environment variables or the `.env.local` file (which is gitignored).
