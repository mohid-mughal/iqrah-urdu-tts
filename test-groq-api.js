// Quick test script to verify Groq API is working
// Run with: node test-groq-api.js

const API_KEY = process.env.GROQ_API_KEY || 'your_groq_api_key_here';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Test with different models
const MODELS = [
  'qwen/qwen3-32b',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it'
];

async function testModel(model) {
  console.log(`\nTesting model: ${model}`);
  console.log('='.repeat(50));
  
  const request = {
    model: model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Translate "salam" from Roman Urdu to Urdu script.' }
    ],
    temperature: 0.3,
    max_tokens: 100,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(request),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('Success! Response:', data.choices[0]?.message?.content);
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('Testing Groq API...');
  console.log('API URL:', API_URL);
  console.log('API Key:', API_KEY.substring(0, 20) + '...');
  
  for (const model of MODELS) {
    const success = await testModel(model);
    if (success) {
      console.log(`\n✅ Model ${model} works!`);
      break;
    } else {
      console.log(`\n❌ Model ${model} failed`);
    }
  }
}

main();
