const path = require("path");
module.exports = {
  entry: {
	app:   "./src/js/app.js",
	admin: "./src/js/admin.js",
	activitylist: "./src/js/activitylist.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
