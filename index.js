const { ChainifyNode } = require("./chainify");
const crypto = require("crypto");
const express = require("express");
const { privateKey, publicKey} = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048
});

const app = express();
app.use(express.json());

const node = new ChainifyNode({
	host: process.env.IP_ADDRESS,
	port: 1234,
	alwaysActiveNodes: [{
		address: process.env.ACTIVE_NODE_ADDRESS,
		port: process.env.ACTIVE_NODE_PORT,
		authenticated: true
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
	console.log("--------------------------");
});

node.onCall((call, node) => {
	console.log("CALL RECEIVED FROM " + JSON.stringify(node));
	console.log(call);
});

node.onCallSend((call, node) => {
	console.log("CALL SENT TO " + JSON.stringify(node));
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