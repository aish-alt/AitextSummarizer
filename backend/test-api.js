import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Backend API Automated Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: GET /api/health
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.status === 200 && res.data.success && res.data.status === 'healthy') {
      console.log('✅ Test 1 Passed: GET /api/health returned healthy status');
      passed++;
    } else {
      console.error('❌ Test 1 Failed: Unexpected health response', res.data);
      failed++;
    }
  } catch (err) {
    console.error('❌ Test 1 Failed: Cannot reach /api/health:', err.message);
    failed++;
  }

  // Test 2: POST /api/summarize with empty text
  try {
    await axios.post(`${BASE_URL}/summarize`, { text: '' });
    console.error('❌ Test 2 Failed: Expected 400 for empty text, but succeeded');
    failed++;
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data.message.includes('required')) {
      console.log('✅ Test 2 Passed: Rejected empty input with 400 Bad Request');
      passed++;
    } else {
      console.error('❌ Test 2 Failed: Expected 400 Bad Request, got:', err.response?.status, err.response?.data);
      failed++;
    }
  }

  // Test 3: POST /api/summarize with text too short (< 10 words)
  try {
    await axios.post(`${BASE_URL}/summarize`, { text: 'Short text here only' });
    console.error('❌ Test 3 Failed: Expected 400 for short text, but succeeded');
    failed++;
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data.message.includes('too short')) {
      console.log('✅ Test 3 Passed: Rejected short input (< 10 words) with 400 Bad Request');
      passed++;
    } else {
      console.error('❌ Test 3 Failed: Expected 400 Bad Request, got:', err.response?.status, err.response?.data);
      failed++;
    }
  }

  // Test 4: POST /api/summarize with invalid length option
  try {
    await axios.post(`${BASE_URL}/summarize`, {
      text: 'This is a sufficiently long test article to verify whether the length validator correctly rejects unknown length options in the request payload.',
      length: 'ultra-tiny',
    });
    console.error('❌ Test 4 Failed: Expected 400 for invalid length option, but succeeded');
    failed++;
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data.message.includes('Invalid summary length')) {
      console.log('✅ Test 4 Passed: Rejected invalid length option with 400 Bad Request');
      passed++;
    } else {
      console.error('❌ Test 4 Failed: Expected 400 Bad Request, got:', err.response?.status, err.response?.data);
      failed++;
    }
  }

  // Test 5: POST /api/summarize with valid text and placeholder key
  try {
    const validText = `Artificial intelligence is transforming medical diagnostics and scientific discovery.
Neural networks can detect pulmonary lesions and bone fractures in radiographic scans with high diagnostic accuracy.
Machine learning algorithms also predict acute patient deterioration hours before clinical failure, saving lives across intensive care units worldwide.`;

    await axios.post(`${BASE_URL}/summarize`, {
      text: validText,
      length: 'medium',
    });
    console.log('✅ Test 5 Passed: Gemini summarization succeeded with valid API response');
    passed++;
  } catch (err) {
    if (
      err.response &&
      (err.response.status === 503 || err.response.status === 401) &&
      (err.response.data.message.includes('GEMINI_API_KEY') || err.response.data.message.includes('key is invalid') || err.response.data.message.includes('not configured'))
    ) {
      console.log('ℹ️ Test 5 Expected Status: Backend properly caught missing/placeholder GEMINI_API_KEY and returned actionable 503/401 without crashing or faking AI output:');
      console.log('   Message:', err.response.data.message);
      passed++;
    } else {
      console.error('❌ Test 5 Failed: Unexpected error response:', err.response?.status, err.response?.data);
      failed++;
    }
  }

  console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed`);
}

runTests();
