"use strict";

var mongoose = require("mongoose");

var colors = require("colors");

var connectDB = function connectDB() {
  var conn;
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
          }));

        case 3:
          conn = _context.sent;
          console.log("MongoDB Connected: ".concat(conn.connection.host).cyan.underline);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Error: ".concat(_context.t0.message).red.bold);
          process.exit();

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = connectDB;
//# sourceMappingURL=db.dev.js.map
