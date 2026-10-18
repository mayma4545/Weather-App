require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  req.session = { userId: parseInt(req.headers['x-test-user'], 10) || 1, userRole: 'Agriculturist' };
  next();
});
app.use('/', require('../routes/index'));

const server = app.listen(4994, async () => {
  console.log('Harness on :4994\n');
  for (let uid = 1; uid <= 15; uid++) {
    try {
      const res = await fetch('http://localhost:4994/api/todo', { headers: { 'x-test-user': String(uid) } });
      if (res.status !== 200) {
        const text = await res.text();
        console.log(`❌ user ${uid}: ${res.status} ${text.slice(0, 120)}`);
      } else {
        const d = await res.json();
        console.log(`✅ user ${uid}: 200, tasks=${d.totalTasks}, plots=${(d.plots || []).length}`);
      }
    } catch (e) {
      console.log(`❌ user ${uid}: ERR ${e.message}`);
    }
  }
  server.close(() => process.exit(0));
});
