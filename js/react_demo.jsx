/** @jsx React.DOM */

const activity_table = (
	<table>
		<tbody>
			<tr>
				<td>test1</td>
				<td>test2</td>
			</tr>
			<tr>
				<td>test3</td>
				<td>test4</td>
			</tr>
		</tbody>
	</table>
)

ReactDOM.render(
	activity_table,
	document.getElementById('activity_table')
);



//$.ajax({
//	url: "../api/activities",
//	type: "GET",
//	dataType: 'json',
//	ContentType: 'application/json',
//	success: function(data) {
//	 
//	 this.setState({data: data});
//	}.bind(this),
//	error: function(jqXHR) {
//	 console.log(jqXHR);
//	}.bind(this)
//})

//const activity_table = (
//    <table>
//      <tbody>{this.state.data.map(function(item, key) {
//             
//               return (
//                  <tr key = {key}>
//                      <td>{item.title}</td>
//                      <td>{item.description}</td>
//                  </tr>
//                )
//             
//             })}</tbody>
//       </table>
//);
