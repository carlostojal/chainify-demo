const { ChainifyNode } = require("./chainify");
const crypto = require("crypto");
const express = require("express");
const { privateKey, publicKey} = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048
});

const app = express();
app.use(express.json());

const node = new ChainifyNode({
	host: "127.0.0.1",
	port: 1234,
	alwaysActiveNodes: [{
		address: process.env.ACTIVE_NODE_ADDRESS,
		port: process.env.ACTIVE_NODE_PORT
	}],
	networkAuthentication: {
		name: "chainify_test_network",
		secret: "mysupersecret"
	},
	rsaKeyPair: {
		public: publicKey,
		private: privateKey 
	}
});

node.init();

node.onListening((config) => {
	console.log("Node configuration: ");
	console.log(config);
});

node.onCall((call) => {
	console.log(call);
});


app.get("/users", (req, res) => {
	node.getItem("users", (users) => {
		res.send(JSON.parse(users));
	});
});

app.post("/users", (req, res) => {
	try {
		node.setItem("users", JSON.stringify(req.body));
		return res.send("OK");
	} catch(e) {
		return res.send(JSON.stringify(e));
	}
});

app.listen(3000);