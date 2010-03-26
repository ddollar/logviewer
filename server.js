var sys  = require('sys');
var http = require('http');
var fs = require('fs');

var clients = {};

var server = http.createServer(function (request, response) {
  if (request.url == "/") {
    var client_id = Date.now().toString();
    clients[client_id] = [];

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write(client_id);
    response.close();
  } else {
    var client_id = request.url.slice(1);
    var client    = clients[client_id];

    if (client) {
      response.writeHead(200, {});
      while (client.length > 0) {
        response.write(client.shift());
      }
      response.write("");
      response.close();
    } else {
      response.writeHead(404, {});
      response.close();
    }
  }
});

var monitor_file = function(filename) {
  var cmd = process.createChildProcess("tail", ["-f", filename]);
  cmd.addListener("output", function(data) {
    for (var client_id in clients) {
      clients[client_id].push(data);
    }
  });
};

setInterval(function() {
  sys.puts("sending some output " + Date.now().toString());
}, 5000);

fs.readdir("log", function(err, files) {
  files.forEach(function(file) {
    sys.puts("Watching: " + file);
    monitor_file("log/" + file);
  });
});

server.listen(process.env["SERVER_PORT"] || 8000);
