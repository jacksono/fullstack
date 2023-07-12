const http = require('http');


const server = http.createServer((req, res) => {
	res.write("SDG AI LAB test");
	res.end();
});

server.listen(3001);

console.log("Server started on port 3001");
