const path = require("path");
module.exports = {
  entry: {
	app:   "./src/js/app.js",
	admin: "./src/js/admin.js",
	activitylist: "./src/js/activitylist.js",
    teacher: "./src/js/teacher.js",
    teacher_profile: "./src/js/teacher_profile.js",
    student_profile: "./src/js/student_profile.js",
    studentlist: "./src/js/studentlist.js",
    userlist: "./src/js/userlist.js",
    eval: "./src/js/eval.js",
    eval_landing: "./src/js/eval_landing.js",
    teacher_landing: "./src/js/teacher_landing.js",
    activitycreation: "./src/js/activitycreation.js",
    student_teacher_assign: "./src/js/student_teacher_assign.js",
    student_activity: "./src/js/student_activity.js",
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
