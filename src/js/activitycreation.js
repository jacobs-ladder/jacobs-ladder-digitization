$.put = function(url, data, callback, type){
 
  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }
 
  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
}


class ColumnsFieldSet extends React.Component{
	constructor(props){
		super(props);

		this.state = {
		  	columns: [{ title: "", type:"numeric" }]
		}

		this.add = this.add.bind(this);
	}

	add() {
		this.setState({ columns: this.state.columns.concat({ title: "", type:"numeric" }) });
	}

	remove(index) {
		this.setState({ columns : this.state.columns.filter((s, sidx) => index !== sidx) });
	}

	titleChange(index, value) {
		var columns = this.state.columns
		columns[index].title = value
		this.setState({ columns });
	}

	typeChange(index, value) {
		var columns = this.state.columns
		columns[index].type = value
		this.setState({ columns });
	}

	getColumns(){
		return this.state.columns.map((column,index) => {
			return {
				"title":column.title,
		 		"number":index,
		 		"data_type":column.type
			}
		});
	}

    componentDidMount(){
		if(this.props.activity != -1){
        	var self = this;
			$.get( "/api/activity", {activity : this.props.activity}
			, function( data ) {
				var activity = JSON.parse(data);
				self.setState({columns:activity.columns.map(col => { return {title:col[0], type:col[1]}; })});
			});
		}
    }

  	render () {
    	const columns = this.state.columns.map((column, index) => {
		  	return (
				<div key={index}>
					<br/>
					Title: <input type="text" value={column.title}
							onChange={(evt) => this.titleChange(index, evt.target.value)}/>
					<span>  </span>
					Type: <select name="input_type" value={column.type}
							onChange={(evt) => this.typeChange(index, evt.target.value)}>
			  			<option value="numeric">Numeric</option>
			  			<option value="boolean">Checkbox</option>
			  			<option value="string">Text</option>
			  			<option value="timestamp">Time</option>
					</select>
					<span>  </span>
					<button onClick={() => this.remove(index)}>Remove</button>
				</div>
			)
    	});

		return(
			<div>
				<p>Columns</p>
		  		<button onClick={ this.add }>Add Column</button> <br/>
		  		<div>{ columns }</div>
			</div>
		);
  	}
}
class RowsFieldSet extends React.Component{
	constructor(props){
		super(props);

		this.state = {
		  	rows: [""]
		}

		this.add = this.add.bind(this);
	}

	add() {
		this.setState({ rows: this.state.rows.concat("") });
	}

	remove(index) {
		this.setState({ rows : this.state.rows.filter((s, sidx) => index !== sidx) });
	}

	titleChange(index, value) {
		var rows = this.state.rows
		rows[index] = value
		this.setState({ rows });
	}

	getRows(){
		return this.state.rows.map((row,index) => {
			return {
				"title":row,
		 		"number":index,
			}
		});
	}
    componentDidMount(){
		if(this.props.activity != -1){
        	var self = this;
			$.get( "/api/activity", {activity : this.props.activity}
			, function( data ) {
				var activity = JSON.parse(data);
				self.setState({rows:activity.rows});
			});
		}
    }

  	render () {
    	const rows = this.state.rows.map((row, index) => {
		  	return (
				<div key={index}>
					<br/>
					Title: <input type="text" value={row}
							onChange={(evt) => this.titleChange(index, evt.target.value)}/>
					<span>  </span>
					<button onClick={() => this.remove(index)}>Remove</button>
				</div>
			)
    	});

		return(
			<div>
				<p>Rows</p>
		  		<button onClick={ this.add }>Add Row</button> <br/>
		  		<div>{ rows }</div>
			</div>
		);
  	}
}

class ActivityInput extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			title:"",
			type:"numbers",
			instructions:""
		}
	}

    componentDidMount(){
		if(this.props.activity != -1){
        	var self = this;
			$.get( "/api/activity", {activity : this.props.activity}
			, function( data ) {
				var activity = JSON.parse(data);
				self.setState({ title : activity.title, type : activity.activity_type_label, instructions : activity.instructions });
			});
		}
    }

	formSubmit(event){
		var columns_and_rows_json = JSON.stringify({
			"columns": this.refs.columns.getColumns(),
			"rows":this.refs.rows.getRows()
		});
		console.log(columns_and_rows_json);
		$.post('../api/activity', { title:this.state.title,
									activity_type:this.state.type,
									instructions:this.state.instructions,
									columns_and_rows : columns_and_rows_json},
			function(returnedData){
				 console.log(returnedData);
		});
	}

	formSave(event){
		var columns_and_rows_json = JSON.stringify({
			"columns": this.refs.columns.getColumns(),
			"rows":this.refs.rows.getRows()
		});
		console.log(columns_and_rows_json);
		$.put('../api/activity', { activity:this.props.activity,
                                    title:this.state.title,
									activity_type:this.state.type,
									instructions:this.state.instructions,
									columns_and_rows : columns_and_rows_json},
			function(returnedData){
				 console.log(returnedData);
		});
	}

	render() {
		return (
			<div>
				<h2>{this.props.activity == -1 ? "Create" : "Edit"} an Activity</h2>
			  		<p>Title: <input type="text" name="title" value={this.state.title}
									onChange={(evt) => this.setState({ title:evt.target.value }) }/></p>
			  		<p>Type of Activity: <select name="activity_type" value={this.state.type}
									onChange={(evt) => this.setState({ type:evt.target.value }) }>
				  		<option value="numbers">Numbers</option>
				  		<option value="reading">Reading</option>
				  		<option value="motor">Motor</option>
				  		<option value="visual">Visual</option>
					</select></p>
			  	<p>Instructions: <textarea name="instructions"rows="10" cols="50" value={this.state.instructions}
									onChange={(evt) => this.setState({ instructions:evt.target.value }) }></textarea></p>
			  	<ColumnsFieldSet ref="columns" activity={this.props.activity}/>
				<br/>
			  	<RowsFieldSet ref="rows" activity={this.props.activity}/>
				<br/>
				<form action="/activitylist">
				  <p><input type="submit" value="Save Activity" onClick={(evt) => {
																if(this.props.activity == -1){
																	this.formSubmit(evt);
																} else {
																	this.formSave(evt);
																}}}/></p>
				</form>
		  </div>
	  );
	}
}

ReactDOM.render(
  <ActivityInput activity={activity_id}/>,
  document.getElementById('body')
);
