var sys  = require('sys');
var http = require('http');
var fs = require('fs');

var clients = [];

var server = http.createServer(function (request, response) {
  sys.puts("CONNECTED!");

  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("Log Server 0.1\n");
  response.write("\n");

  request.connection.addListener("close", function() {
    sys.puts("CLOSED!");
  });
  
  clients.push(response);
});

var monitor_file = function(filename) {
  var cmd = process.createChildProcess("tail", ["-f", filename]);
  cmd.addListener("output", function(data) {
    clients.forEach(function(client) {
      client.write(data);
    });
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
