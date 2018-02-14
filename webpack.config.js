const path = require("path");
module.exports = {
  entry: {
	app:   "./src/js/app.js",
	admin: "./src/js/admin.js",
	activitylist: "./src/js/activitylist.js",
<<<<<<< HEAD
    studentlist: "./src/js/studentlist.js",
    teacher: "./src/js/teacher.js",
=======
  studentlist: "./src/js/studentlist.js",
  teacher_profile: "./src/js/teacher_profile.js",
  student_profile: "./src/js/student_profile.js"
>>>>>>> a933e59167b46d7a9ab066da8d89613f0c65c4db
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
