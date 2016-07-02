var fs = require('fs');
var path = require('path');

module.exports = {
    exists: function (filepath) {
        return fs.existsSync(filepath);
    },
    isDir: function (filepath) {
        return this.exists(filepath) && fs.statSync(filepath).isDirectory();
    }
}