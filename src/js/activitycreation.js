
const activity_input = (
  <div>
	<h2>Create an Activity</h2>
	<form action="../api/activity" method="post">
	  <p>Title: <input type="text" name="title"/></p>
	  <p>Type of Activity: <select name="activity_type">
		  <option value="numbers">Numbers</option>
		  <option value="reading">Reading</option>
		  <option value="motor">Motor</option>
		  <option value="visual">Visual</option>
		</select></p>
	  <p>Instructions: <textarea name="instructions" rows="10" cols="30"></textarea></p>
	  <p><input type="submit" value="Create Activity"/></p>
	</form>
  </div>
  );



ReactDOM.render(
  activity_input,
  document.getElementById('body')
);
