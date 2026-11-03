const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { app, db } = require('../src/app');

let server;
let base;

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    base = `http://localhost:${server.address().port}`;
    resolve();
  });
}));

after(() => {
  server.close();
  db.close();
});

test('lists the whole menu', async () => {
  const res = await fetch(`${base}/dishes`);
  assert.strictEqual(res.status, 200);
  const dishes = await res.json();
  assert.strictEqual(dishes.length, 7);
});

test('gets one dish by id', async () => {
  const res = await fetch(`${base}/dishes/1`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).name, 'Omelette');
});

test('returns 404 for a missing dish', async () => {
  const res = await fetch(`${base}/dishes/999`);
  assert.strictEqual(res.status, 404);
});
