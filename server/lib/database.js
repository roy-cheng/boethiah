const repoDirectory = '.temp/repo';
const path = require('path');
const fs = require('fs-plus');
const enbx = require('./../core/enbx');

function createRefConverter(id) {
  return res => {
    var url = 'api/res/' + id + '/' + path.basename(res).replace(/^Resources\\/i, '');
    return url;
  };
}

function save(enbxFile, name) {
  var id = encodeURIComponent(name);
  var promise = new Promise((resolve, reject) => {
    var unzipDir = path.join(repoDirectory, name);
    enbx.load(enbxFile, {
      unzip: unzipDir,
      convertRef: createRefConverter(id)
    }).then(doc => {
      doc.name = name;
      doc.id = id;
      fs.writeFile(path.join(unzipDir, 'doc.json'), JSON.stringify(doc), { encoding: 'utf8' }, function (err) {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    }).catch(err => {
      throw err;
    });
  });
  return promise;
}

function get(id) {
  var name = decodeURIComponent(id);
  var file = path.join(repoDirectory, name, 'doc.json');
  var promise = new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
  return promise;
}

function list() {
  var promise = new Promise((resolve, reject) => {
    fs.readdir(repoDirectory, function (err, files) {
      if (err) {
        reject(err);
      }
      files = files.map(f => {
        return {
          name: f,
          id: encodeURIComponent(f)
        };
      });
      resolve(files);
    });
  });
  return promise;
}

function getResourcePath(did, rid) {
  var file = path.join(repoDirectory, decodeURIComponent(did), 'resources', rid);
  return path.resolve(file);
}

exports.save = save;
exports.list = list;
exports.get = get;
exports.getResourcePath = getResourcePath;