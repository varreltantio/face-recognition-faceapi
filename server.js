const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const labelsDir = path.join(__dirname, "labels");

app.use(cors());
app.use(express.static("public"));

app.get("/api/labels", (req, res) => {
  fs.readdir(labelsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Gagal membaca folder labels" });
    }
    const labels = files.filter((file) => fs.lstatSync(path.join(labelsDir, file)).isDirectory());
    res.json(labels);
  });
});

app.get('/api/labels/:label', (req, res) => {
  const label = req.params.label;
  const dirPath = path.join(__dirname, 'labels', label);
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }
    const pngFiles = files.filter(file => file.endsWith('.png'));
    res.json(pngFiles);
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
