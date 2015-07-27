var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers.js');
var urlParser = require('url');
// require more modules/folders here!

var actions = {
  GET: function (req, res) {
    var parts = urlParser.parse(req.url);
    var urlPath;
    if (parts.pathname === '/') {
      urlPath = '/index.html';
    } else{
      urlPath = parts.pathname;
    }
    utils.serveAssets(res, urlPath, function() {
      archive.isUrlInList(urlPath.slice(1), function(found) {
        if (found) {
          utils.sendRedirect(res, '/loading.html')
        } else {
          utils.send404(res);
        }
      });
    });
  },

  POST: function (req, res) {
    utils.collectData(req, function(data) {
      var url = JSON.parse(data).url;
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              utils.sendRedirect(res, '/'+url);
            } else {
              utils.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            utils.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    utils.send404(res);
  }
};

