const { ChainifyNode } = require("../chainify");
const crypto = require("crypto");
const express = require("express");
const { privateKey, publicKey} = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048
});

const app = express();
app.use(express.json());

const node1 = new ChainifyNode({
	host: "127.0.0.1",
	port: 1234,
	networkAuthentication: {
		name: "chainify_test_network",
		secret: "mysupersecret"
	},
	rsaKeyPair: {
		public: publicKey,
		private: privateKey 
	}
});

node1.init();

const node2 = new ChainifyNode({
	host: "127.0.0.1",
	port: 1235,
	alwaysActiveNodes: [{
		address: "127.0.0.1",
		port: 1234
	}],
	networkAuthentication: {
		name: "chainify_test_network", // this must be unique
		secret: "mysupersecret"
	},
	rsaKeyPair: {
		public: publicKey,
		private: privateKey
	}
});

node2.init();

node1.onListening(() => {
	// console.log("node1 listening");
})

node2.onListening(() => {
	// console.log("node2 listening");
});

node1.onCall((call) => {
	console.log("RECEIVED BY NODE1");
	console.log(call);
});

node2.onCall((call) => {
	console.log("RECEIVED BY NODE2");
	console.log(call);
});

// node.getItem("test");

// console.log(node1);
// console.log(node2);

app.get("/users", (req, res) => {
	node1.getItem("users", (users) => {
		res.send(JSON.parse(users));
	});
});

app.post("/users", (req, res) => {
	try {
		node1.setItem("users", JSON.stringify(req.body));
		return res.send("OK");
	} catch(e) {
		return res.send(JSON.stringify(e));
	}
});

app.listen(3000);