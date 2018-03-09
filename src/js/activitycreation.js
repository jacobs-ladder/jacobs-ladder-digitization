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

	render() {
		return (
			<div>
				<h2>Create an Activity</h2>
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
			  	<ColumnsFieldSet ref="columns"/>
				<br/>
			  	<RowsFieldSet ref="rows"/>
				<br/>
			  	<p><input type="submit" value="Create Activity" onClick={(evt) => this.formSubmit(evt)}/></p>
		  </div>
	  );
	}
}

ReactDOM.render(
  <ActivityInput />,
  document.getElementById('body')
);
