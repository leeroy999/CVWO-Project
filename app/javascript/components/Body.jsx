import React from "react"
import { Button, Grid, GridColumn, Icon, Label } from "semantic-ui-react";

class Body extends React.Component {

  state = {
    tasks: [],
    category: ""
  }

  componentDidUpdate(prevProps){
    if (this.props.tasks !== prevProps.tasks ||
      this.props.category !== prevProps.category){
      this.setState({
        tasks: this.props.tasks,
        category: this.props.category
      });
    }
  }

  /*
    <span>Task {task.id}: {task.title}</span><br/>
    <span>Category: {task.category}</span><br/>
    <span>Description: {task.description}</span>
  */

  render() {
    return (
      <div style = {{padding: '20px' }}>
        {this.state.tasks.slice(0).reverse()
          .filter((task) => (this.state.category === "") || (task.category === this.state.category))
          .map((task) => {
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
        })}
      </div>
    );
  }

  handleFilter(task) {
    return (this.props.category === "") || (task.category === this.props.category);
  }

}

export default Body;