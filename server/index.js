const express = require("express");
const server = express();
const mongoose = require("mongoose");
const fs = require("fs");
const Url = require("./Url");
const res = require("express/lib/response");
server.use(express.json({ extended: true }));
server.use(express.urlencoded());
server.use(express.static(__dirname + "/static")); //Serves resources from public folder

mongoose
	.connect("mongodb://localhost:27017/appdb", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("connected to db");
	})
	.catch((err) => console.log(err));

function render(filename, params) {
	let data = fs.readFileSync(filename, "utf8");
	for (const key in params) {
		data = data.replace("{" + key + "}", params[key]);
	}
	return data;
}

async function run(targetUrl) {
	const url = await Url.create({ originUrl: targetUrl });
	url.shortUrl = "localhost:5500/client/" + url._id;
	url.save();
	return "localhost:5500/client/" + url._id;
}

// async function findById(objectId) {
// 	try {
// 		const url = await Url.findById(objectId);
// 		return url;
// 	} catch (e) {
// 		console.log(e.message);
// 	}
// }

server.get("/client/:id?", async (req, res) => {
	const id = req.params.id;
	if (id) {
		const url = await Url.findById(id);
		res.redirect(url?.originUrl);
	} else {
		res.send(render("./index.html"));
	}
});

server.post("/client/shortUrl", (req, res) => {
	console.log(req.body);
	const shortUrl = run(req.body.url);
	shortUrl.then((e) => {
		console.log(e);
		res.sendfile(__dirname + "/client/shortUrl.html", (err) => {
			console.log(err);
		});
	});
});

server.listen(5500, () => {
	console.log("running");
});
