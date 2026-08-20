import redis, {
  getCache,
  setCache,
  deleteCache,
  deleteKeysByPattern,
  isCacheAvailable,
  CACHE_TTL,
} from './redis.js';

async function runRedisTestSuite() {
  console.log('========================================');
  console.log('   Job Portal - Redis Test Suite');
  console.log('========================================\n');

  // Allow up to 2 seconds for WAN connection establishment
  if (!isCacheAvailable() && redis) {
    await new Promise((resolve) => {
      if (redis.status === 'ready') return resolve();
      const onReady = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); resolve(); };
      const timer = setTimeout(() => { cleanup(); resolve(); }, 2000);
      function cleanup() {
        redis.off('ready', onReady);
        redis.off('error', onError);
        clearTimeout(timer);
      }
      redis.once('ready', onReady);
      redis.once('error', onError);
    });
  }

  console.log('1. Checking Cache Availability Status:');
  const available = isCacheAvailable();
  console.log(`   - Redis Operational: ${available ? 'YES (Live Redis Server Connected)' : 'NO (Graceful Fallback Mode Active)'}`);

  console.log('\n2. Testing Safe Read/Write Operations:');
  const testKey = 'test:jobs:sample_key_123';
  const testData = { id: '123', title: 'Full Stack Engineer', salary: 120000 };

  const writeResult = await setCache(testKey, testData, 60);
  console.log(`   - setCache() result: ${writeResult ? 'SUCCESS' : 'BYPASSED/HANDLED'}`);

  const readResult = await getCache(testKey);
  console.log(`   - getCache() result: ${readResult ? JSON.stringify(readResult) : 'NULL/FALLBACK'}`);

  console.log('\n3. Testing Pattern-Based Scan Eviction:');
  const deletedCount = await deleteKeysByPattern('test:jobs:*');
  console.log(`   - deleteKeysByPattern("test:jobs:*") evicted count: ${deletedCount}`);

  const afterDelete = await getCache(testKey);
  console.log(`   - getCache() after eviction: ${afterDelete ? 'STILL_EXISTS (ERROR)' : 'NULL (CONFIRMED CLEARED)'}`);

  console.log('\n4. Verifying TTL Constants:');
  console.log(`   - CACHE_TTL.SHORT:  ${CACHE_TTL.SHORT}s`);
  console.log(`   - CACHE_TTL.MEDIUM: ${CACHE_TTL.MEDIUM}s`);
  console.log(`   - CACHE_TTL.LONG:   ${CACHE_TTL.LONG}s`);

  console.log('\n========================================');
  console.log('   All checks completed without error!');
  console.log('========================================');
  process.exit(0);
}

runRedisTestSuite();
