import React from "react"
import { Button, Grid, GridColumn, Icon} from "semantic-ui-react";

class Body extends React.Component {

  state = {
    tasks: [], // array of task objects, from props
    category: "" // category for filtering, from props
  }

  // updates state when props change
  // Parameters: prevProps --> Object
  componentDidUpdate(prevProps){
    if (this.props.tasks !== prevProps.tasks ||
      this.props.category !== prevProps.category){
      this.setState({
        tasks: this.props.tasks,
        category: this.props.category
      });
    }
  }

  // renders list of tasks from latest to earliest (reverse order)
  render() {
    return (
      <div style = {{padding: '20px' }}>
        {this.state.tasks.slice(0).reverse()
          .filter(this.handleFilter)
          .map(this.showTask)}
      </div>
    );
  }

  // filters task based on the category chosen in Header (passed as props by App.jsx)
  // Parameters: task --> Object
  handleFilter = (task) => {
    return (this.state.category === "") || (task.category === this.state.category);
  }

  /* 
    - Formats task into buttons, showing: date | task title | edit button | delete button
    - Date is formatted as DD/Month/YYYY
    - Edit and delete button links to props functions in App.jsx, while task title opens Popup (modal)
    
    Parameters: task --> Object
  */
  showTask = (task) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const date = new Date(task.updated_at);
    const dateString = date.getDate() + " "
      + monthNames[date.getMonth()] + " "
      + date.getFullYear();
    return (
      <div key={task.id}>
          <Grid stackable columns = {16}>
            <GridColumn width={12} stretched>
              <Button fluid color = 'vk' 
                labelPosition = 'left'
                label = {dateString} 
                content = {<h3>{task.title}</h3>}
                onClick = {() => this.props.showOpen(task)}/>
            </GridColumn>
            <GridColumn width={2} stretched>
              <Button fluid style = {{alignContent: 'center'}}
                onClick = {() => this.props.updateOpen(task)}>
                <span>
                  <Icon name = 'edit'></Icon>Edit
                </span>
              </Button>
            </GridColumn>
            <GridColumn width={2} stretched>
              <Button fluid style = {{alignContent: 'center'}}
                onClick = {() => this.props.deleteOpen(task)}>
                <span style = {{alignContent: 'center'}}>
                  <Icon name = 'trash alternate'></Icon>Delete
                </span>
              </Button>
            </GridColumn>
          </Grid>
      </div>
    );
  }
}

export default Body;