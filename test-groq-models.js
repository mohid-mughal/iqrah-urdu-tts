// Test which Groq models are available with your API key
const API_KEY = process.env.GROQ_API_KEY || 'your_groq_api_key_here';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Models to test (from Groq documentation)
const MODELS_TO_TEST = [
  'qwen/qwen3-32b',
  'openai/gpt-oss-120b',
];

async function testModel(model) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${model}`);
  console.log('='.repeat(60));
  
  const request = {
    model: model,
    messages: [
      { role: 'user', content: 'Translate "salam" from Roman Urdu to Urdu script' }
    ],
    temperature: 0.3,
    max_tokens: 50,
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
      console.log('❌ FAILED');
      console.log('Error:', errorText.substring(0, 200));
      return null;
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content;
    console.log('✅ SUCCESS!');
    console.log('Response:', result);
    return model;
  } catch (error) {
    console.log('❌ FAILED');
    console.error('Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('\n🔍 Testing Groq API Models...\n');
  console.log('API URL:', API_URL);
  console.log('API Key:', API_KEY.substring(0, 20) + '...\n');
  
  const workingModels = [];
  
  for (const model of MODELS_TO_TEST) {
    const result = await testModel(model);
    if (result) {
      workingModels.push(result);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  if (workingModels.length > 0) {
    console.log('\n✅ Working models:');
    workingModels.forEach(model => console.log(`   - ${model}`));
    console.log(`\n💡 Use this in your code:`);
    console.log(`   private readonly MODEL = '${workingModels[0]}';`);
  } else {
    console.log('\n❌ No working models found!');
    console.log('   - Check your API key');
    console.log('   - Check your internet connection');
    console.log('   - Verify Groq API is accessible from your location');
  }
  
  console.log('\n');
}

main().catch(console.error);
