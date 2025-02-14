const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

app.use((req, res) => {
  res.end('Hello World!');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
