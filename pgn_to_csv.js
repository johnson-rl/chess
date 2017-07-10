const fs = require('fs');

let ws = fs.createWriteStream('pgn.csv')

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

readFiles('PGN_files/GK_Masterclass/', function(filename, content) {
  ws.write(content.replace(/(\r\n|\n|\r)/gm,"") + '\n')
}, function(err) {
  throw err;
});
