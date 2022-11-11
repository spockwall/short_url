const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/appdb");

const UrlSchema = new mongoose.Schema({
	originUrl: {
		type: String,
		required: true,
	},
	shortUrl: String,
});

module.exports = mongoose.model("Url", UrlSchema);
