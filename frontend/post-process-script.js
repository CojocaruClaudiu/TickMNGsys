const fs = require('fs');
const path = require('path');

// Path to the webpack-stats.json file
const statsFilePath = path.resolve(__dirname, 'webpack-stats.json');

// Read the existing stats file
fs.readFile(statsFilePath, (err, data) => {
  if (err) throw err;

  const stats = JSON.parse(data);
  const formattedStats = {
    status: stats.status,
    publicPath: stats.publicPath,
    chunks: {}
  };

  // Transform assets into chunks
  for (const chunkName in stats.chunks) {
    formattedStats.chunks[chunkName] = stats.chunks[chunkName].map(filePath => {
      return {
        name: path.basename(filePath),
        path: filePath
      };
    });
  }

  // Write the new stats file
  fs.writeFile(statsFilePath, JSON.stringify(formattedStats, null, 2), err => {
    if (err) throw err;
    console.log('webpack-stats.json reformatted successfully.');
  });
});
