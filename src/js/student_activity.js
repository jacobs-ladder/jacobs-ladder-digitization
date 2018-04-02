class ActivityView extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			rows:[],
			cols:[],
			grid:[],
			activity:{},
			student:{}
		}
	}

    componentDidMount(){
        var self = this;
		$.get( "/api/student_activity", 
				{student : this.props.student, 
				 activity : this.props.activity,
				 student_activity_created : this.props.student_activity_created}
		, function( dat ) {
			var data = JSON.parse(dat);
			console.log(data);
			self.setState({ grid : data.data_grid, rows : data.row_titles, cols : data.column_titles });
		});
		$.get( "/api/activity", {activity : this.props.activity}
		, function( data ) {
			self.setState({ activity : JSON.parse(data) });
		});
		$.get( "/api/student", {student : this.props.student}
		, function( data ) {
			self.setState({ student : JSON.parse(data) });
		});
    }

	formSubmit(event){
		var self = this;
		const data = this.state.rows.map((row, rindex) => {
			var rowidx = rindex
			 return self.state.grid[rindex].map((cell, cindex) => {
				return { data : cell.data, row_number : rowidx + 1, column_number : cindex + 1};
			});
    	});
		var flat_data = [].concat.apply([], data);
		$.post('/api/student_activity', { student : this.props.student, 
				 				  activity : this.props.activity,
				 				  student_activity_created : this.props.student_activity_created,
								  data: JSON.stringify(flat_data)},
			function(returnedData){
				 console.log(returnedData);
		});
	}


	gridChange(row, col, value) {
		var grd = this.state.grid
		grd[row][col].data = value
		this.setState({ grid : grd });
	}

	render() {
        var self = this;
		const rows = this.state.rows.map((row, rindex) => {
			var rowidx = rindex
			const cells = self.state.grid[rindex].map((cell, cindex) => {
				if(cell.data_type = 'string'){
					return (<td><input type='text' value={cell.data}
								onChange={(evt) => this.gridChange(rowidx, cindex, evt.target.value)}></input></td>);
				}
				if(cell.data_type = 'numeric'){
					return (<td><input type='number' step='.0001' value={cell.data}
								onChange={(evt) => this.gridChange(rowidx, cindex, evt.target.value)}>></input></td>);
				}
			});

		  	return (
				<tr>
					<td>{row}</td>
					{ cells }
				</tr>
			);
    	});

		const head = this.state.cols.map((col, index) => {

		  	return (
					<th>{col}</th>
			);
    	});

		return (
			<div>
				<p>Title: {this.state.activity.title}</p>
			  	<p>Type of Activity: {this.state.activity.activity_type_label}</p>
			  	<p>Instructions: {this.state.activity.instructions}</p>

				<br/>

				
			   	<p>Student First Name: {this.state.student.firstname}</p>
			   	<p>Student Last Name: {this.state.student.lastname}</p>

				<br/>

				<p>Data Input</p>
		  		<table>
					<thead><tr><th></th> {head}</tr></thead>
					<tbody>{ rows }</tbody>
				</table>
				<br/>
			  	<p><input type="submit" value="Save Changes" onClick={(evt) => this.formSubmit(evt)}/></p>
			</div>
		);
	}
}

const student_activity = (
	<ActivityView activity={activity_id} student={student_id} student_activity_created={activity_created}/>
);

ReactDOM.render(
student_activity,
document.getElementById('body'),
);
