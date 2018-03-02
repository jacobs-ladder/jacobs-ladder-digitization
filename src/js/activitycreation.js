const activity_input = (
  <div>
	<h2>Create an Activity</h2>
	<form action="#" id="activity_form">
	  <p>Title: <input type="text" name="title" id="activity_title"/></p>
	  <p>Type of Activity: <select name="activity_type" id="activity_type">
		  <option value="numbers">Numbers</option>
		  <option value="reading">Reading</option>
		  <option value="motor">Motor</option>
		  <option value="visual">Visual</option>
		</select></p>
	  <p>Instructions: <textarea name="instructions" id="activity_instructions" rows="10" cols="30"></textarea></p>
	  <p><input type="submit" value="Create Activity"/></p>
	</form>
  </div>
  );



ReactDOM.render(
  activity_input,
  document.getElementById('body')
);

$( "#activity_form" ).submit(function( event ) {
 	event.preventDefault();
	var columns_and_rows_json = JSON.stringify({"columns":
	 [
	   {
		 "title":"first column title (test activity)",
		 "number":1,
		 "data_type":"numeric"
	   },
	   {
		 "title":"second column title (test activity)",
		 "number":1,
		 "data_type":"numeric"
	   },
	   {
		 "title":"third column title (test activity)",
		 "number":1,
		 "data_type":"numeric"
	   }
	 ],
	 "rows":
	 [
	   {
		 "title":"first row title (test activity)",
		 "number":1
	   },
	   {
		 "title":"second row title (test activity)",
		 "number":1
	   }
	 ]
	});
	//console.log(columnsrows);
	$.post('../api/activity', { title:$( "#activity_title" ).val(), 
								activity_type:$('#activity_type').val(), 
								instructions:$('#activity_instructions').val(),
								columns_and_rows : columns_and_rows_json}, 
		function(returnedData){
			 console.log(returnedData);
	});
});
