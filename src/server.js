const { app } = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Chez Mona menu API on http://localhost:${port}`);
});
