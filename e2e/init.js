const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/mocha/adapter');

before(async () => {
  await detox.init(config, { launchApp: false });

  if (device.getPlatform() === 'ios') {
    await device.launchApp({newInstance: false, permissions: {notifications: 'YES'}});
  } else {
    await device.launchApp({newInstance: false});
  }
});

beforeEach(async function () {
  await adapter.beforeEach(this);
});

afterEach(async function () {
  await adapter.afterEach(this);
});

after(async () => {
  await detox.cleanup();
});
