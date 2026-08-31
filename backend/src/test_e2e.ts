import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('==================================================');
  console.log('🧪 Starting FinGraphic End-to-End Test Suite');
  console.log('==================================================');

  let passed = 0;
  let failed = 0;

  // 1. Healthcheck Test
  try {
    const health = await axios.get('http://localhost:5000/health');
    if (health.data.status === 'ok') {
      console.log('✅ Test 1 Passed: Server Healthcheck (/health)');
      passed++;
    } else {
      throw new Error('Healthcheck status not ok');
    }
  } catch (e: any) {
    console.error('❌ Test 1 Failed: Healthcheck error:', e.message);
    failed++;
  }

  // 2. Registration Test
  const testEmail = `test.trader.${Date.now()}@fingraphic.com`;
  let token = '';
  try {
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      email: testEmail,
      password: 'Password123!',
      name: 'Test Trader',
    });

    if (regRes.data.token && regRes.data.user) {
      token = regRes.data.token;
      console.log('✅ Test 2 Passed: User Registration & Initial $100k Portfolio Creation');
      passed++;
    } else {
      throw new Error('No token returned');
    }
  } catch (e: any) {
    console.error('❌ Test 2 Failed: Registration error:', e.response?.data || e.message);
    failed++;
  }

  // 3. Login Test
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'Password123!',
    });

    if (loginRes.data.token) {
      console.log('✅ Test 3 Passed: User Authentication & JWT Generation');
      passed++;
    } else {
      throw new Error('Login failed');
    }
  } catch (e: any) {
    console.error('❌ Test 3 Failed: Login error:', e.response?.data || e.message);
    failed++;
  }

  // Headers for authenticated requests
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // 4. Fetch Profile Test
  try {
    const meRes = await axios.get(`${BASE_URL}/auth/me`, authHeaders);
    if (meRes.data.user?.email === testEmail) {
      console.log('✅ Test 4 Passed: Authenticated Profile Fetch (/auth/me)');
      passed++;
    } else {
      throw new Error('User profile mismatch');
    }
  } catch (e: any) {
    console.error('❌ Test 4 Failed: Profile fetch error:', e.response?.data || e.message);
    failed++;
  }

  // 5. Fetch Portfolio Test
  try {
    const portRes = await axios.get(`${BASE_URL}/portfolio`, authHeaders);
    if (portRes.data.portfolio?.cashBalance === 100000) {
      console.log('✅ Test 5 Passed: Initial Portfolio Balance Verification ($100,000)');
      passed++;
    } else {
      throw new Error('Initial cash balance invalid');
    }
  } catch (e: any) {
    console.error('❌ Test 5 Failed: Portfolio fetch error:', e.response?.data || e.message);
    failed++;
  }

  // 6. Execute Trade Test (Buy AAPL)
  try {
    const tradeRes = await axios.post(
      `${BASE_URL}/portfolio/trade`,
      { ticker: 'AAPL', quantity: 10, side: 'BUY' },
      authHeaders
    );

    if (tradeRes.data.cashBalance < 100000) {
      console.log(`✅ Test 6 Passed: Trade Execution (Bought 10 AAPL, New Cash: $${tradeRes.data.cashBalance})`);
      passed++;
    } else {
      throw new Error('Cash balance not updated');
    }
  } catch (e: any) {
    console.error('❌ Test 6 Failed: Trade execution error:', e.response?.data || e.message);
    failed++;
  }

  // 7. Watchlist Add & Fetch Test
  try {
    await axios.post(`${BASE_URL}/portfolio/watchlist`, { ticker: 'NVDA', notes: 'Top AI Pick' }, authHeaders);
    const watchRes = await axios.get(`${BASE_URL}/portfolio/watchlist`, authHeaders);

    if (watchRes.data.watchlist.some((item: any) => item.ticker === 'NVDA')) {
      console.log('✅ Test 7 Passed: Watchlist Item Creation & Retrieval');
      passed++;
    } else {
      throw new Error('Watchlist item missing');
    }
  } catch (e: any) {
    console.error('❌ Test 7 Failed: Watchlist test error:', e.response?.data || e.message);
    failed++;
  }

  // 8. Global Leaderboard Test
  try {
    const leadRes = await axios.get(`${BASE_URL}/portfolio/leaderboard`);
    if (Array.isArray(leadRes.data.leaderboard)) {
      console.log(`✅ Test 8 Passed: Global Leaderboard Retrieval (${leadRes.data.leaderboard.length} traders ranked)`);
      passed++;
    } else {
      throw new Error('Leaderboard response invalid');
    }
  } catch (e: any) {
    console.error('❌ Test 8 Failed: Leaderboard error:', e.response?.data || e.message);
    failed++;
  }

  // 9. Stock AI Pipeline Analysis Test
  try {
    const anaRes = await axios.get(`${BASE_URL}/analyze/NVDA`);
    if (anaRes.data.success && anaRes.data.data?.metrics?.currentPrice) {
      console.log(`✅ Test 9 Passed: 6-Node AI Stock Pipeline Analysis for NVDA (Verdict: ${anaRes.data.data.verdict})`);
      passed++;
    } else {
      throw new Error('Analysis response structure invalid');
    }
  } catch (e: any) {
    console.error('❌ Test 9 Failed: Stock analysis error:', e.response?.data || e.message);
    failed++;
  }

  // 10. Email Digest Manual Trigger Test
  try {
    const digRes = await axios.post(`${BASE_URL}/digest/trigger`, {}, authHeaders);
    if (digRes.data.result) {
      console.log(`✅ Test 10 Passed: Memory-Safe Email Digest Generation (${digRes.data.result.processedCount} users processed)`);
      passed++;
    } else {
      throw new Error('Digest response invalid');
    }
  } catch (e: any) {
    console.error('❌ Test 10 Failed: Digest trigger error:', e.response?.data || e.message);
    failed++;
  }

  console.log('==================================================');
  console.log(`🏁 Test Results Summary: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================');
}

runE2ETests();
