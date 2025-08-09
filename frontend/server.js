import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(import.meta.dirname, 'dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'dist', 'index.html'));
});

const PORT = process.env.FRONTEND_PORT || 1101;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
