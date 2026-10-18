require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  req.session = { userId: 1, userRole: 'Agriculturist', userFullName: 'Test Farmer' };
  next();
});
app.use('/', require('../routes/index'));

const server = app.listen(4995, async () => {
  console.log('Harness on :4995\n');
  for (const url of ['/api/todo', '/api/todo?plot_id=1']) {
    try {
      const res = await fetch(`http://localhost:4995${url}`);
      const text = await res.text();
      console.log(`${res.status}  GET ${url}`);
      if (res.status !== 200) console.log('   body:', text.slice(0, 300));
      else {
        const d = JSON.parse(text);
        console.log('   totalTasks:', d.totalTasks, '| plots:', (d.plots || []).length);
      }
    } catch (e) {
      console.log(`ERR ${url} :: ${e.message}`);
    }
  }
  server.close(() => process.exit(0));
});
