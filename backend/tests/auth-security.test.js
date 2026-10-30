const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const path = require('node:path');
const test = require('node:test');

// Only signing and middleware run here; no database or provider is loaded.
const accessSecret = randomBytes(32).toString('hex');
const refreshSecret = randomBytes(32).toString('hex');
process.env.JWT_ACCESS_SECRET = accessSecret;
process.env.JWT_REFRESH_SECRET = refreshSecret;
const jwt = require('jsonwebtoken');
const service = require('../src/services/jwtService');
const { checkLoginRateLimit } = require('../src/middleware/loginRateLimiter');

test('missing signing configuration fails instead of using a known key', () => {
  const script = path.resolve(__dirname, '../src/services/jwtService.js');
  for (const missing of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    const env = { ...process.env };
    delete env[missing];
    const result = spawnSync(process.execPath, ['-e', 'require(process.argv[1])', script],
                             { env, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must be configured/);
  }
});

test('access tokens must match the algorithm, issuer, audience and token type', () => {
  const payload = { userId: 1, username: 'maya.bennett', userType: 'office',
                    name: 'Maya Bennett', office_id: 2 };
  assert.equal(service.verifyAccessToken(service.generateAccessToken(payload)).valid, true);
  const options = { issuer: 'adzu-sdu-api', audience: 'adzu-sdu-client' };
  for (const override of [{ issuer: 'another-service' }, { audience: 'another-client' },
                          { algorithm: 'HS384' }]) {
    const token = jwt.sign({ ...payload, type: 'access' }, accessSecret,
                           { ...options, ...override });
    assert.equal(service.verifyAccessToken(token).valid, false);
  }
  const refresh = service.generateRefreshToken(payload.userId);
  assert.equal(service.verifyRefreshToken(refresh).valid, true);
  assert.equal(service.verifyAccessToken(refresh).valid, false);
  service.revokeRefreshToken(refresh);
  assert.equal(service.verifyRefreshToken(refresh).valid, false);
});

test('non-text login names return a client error without crashing', () => {
  for (const username of [{}, [], 42, true]) {
    let status;
    const response = {
      status(value) { status = value; return this; },
      json() { return this; },
    };
    checkLoginRateLimit({ body: { username } }, response, () => assert.fail('invalid input passed'));
    assert.equal(status, 400);
  }
});
