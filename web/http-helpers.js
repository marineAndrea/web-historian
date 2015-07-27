var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Q = require('q');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  
  // check in public folder
  fs.readFile(archive.paths.siteAssets + asset, 'utf8', function(err,data) {
    if (err) {
      // check archive folder
      fs.readFile(archive.paths.archivedSites + asset, 'utf8', function(err, data) {
        if (err) {
          // if not in archive, might be in list, so callback
          callback ? callback() : exports.send404(res);
        } else {
          // file is in archive
          exports.sendResponse(res, data);
        }
      });
    } else {
      // file is public folder
      exports.sendResponse(res, data);
    }
  });
};

exports.collectData = function(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {  // IF ERR???
    callback(data);
  });
};

exports.sendResponse = function(res, obj, status) {
  status = status || 200;
  res.writeHead(status, headers);
  res.end(obj);
};

exports.send404 = function(res) {
  exports.sendResponse(res, '404: Page not found', 404);
};

exports.sendRedirect = function(res, loc, status) {
  status = status || 302;
  res.writeHead(status, {Location: loc});
  res.end();
};
