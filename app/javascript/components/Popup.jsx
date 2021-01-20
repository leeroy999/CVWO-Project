import React from "react"
import { Modal, Form, FormField, TextArea, Input, Button, Dropdown, Icon, Grid, GridColumn} from "semantic-ui-react";

class Popup extends React.Component {

  state = {
    open: false,
    operation: "",
    task: "",
    category: "",
    description: "",
    categories: []
  }

  componentDidUpdate(prevProps){
    if (this.props.popup.open !== prevProps.popup.open || 
      this.props.popup.operation !== prevProps.popup.operation){

        this.setState({
          open: this.props.popup.open,
          operation: this.props.popup.operation,
        });
    }
    if (this.props.popup.task && this.props.popup.task.title
      && this.props.popup.task.title !== prevProps.popup.task.title) {
      this.setState({
        task: this.props.popup.task.title,
        category: this.props.popup.task.category,
        description: this.props.popup.task.description
      });
    }
    if (Object.keys(this.props.categories).length !== Object.keys(prevProps.categories).length) {
      const options = [];
      Object.keys(this.props.categories).map((category, i) => {
          options.push({text: category, value: category});
      })
      this.setState({
        categories: options
      })
    }
  }

  // different popup operations: add, update, show, delete
  render() {
    if (this.state.operation === "add" || this.state.operation === "update") {
      return (
        <Modal open = {this.state.open} 
          onClose = {() => this.state.operation === "add" ? this.handleCancel(true) : this.handleCancel(false)}>
          <Form style = {{padding: '20px'}}>
            <FormField>
              {this.state.operation === "add" 
                ? <h2>Add New Task</h2> 
                : <h2>Edit Task</h2>}
              <label>Task Title:</label>
              <Input placeholder = 'Write your task here.'
                name = "task"
                value = {this.state.task}
                onChange = {this.handleChange}/>
            </FormField>
            <FormField>
              <label>Category:</label>
              <Dropdown placeholder = "Select category" 
                options={this.state.categories} 
                selection search allowAdditions 
                name = "category"
                value = {this.state.category}
                onChange = {this.handleChange}
                onAddItem = {this.handleAddition}/>
            </FormField>
            <FormField>
              <label>Description: </label>
              <TextArea placeholder = 'Write your task description here.'
                name = "description"
                value = {this.state.description}
                onChange = {this.handleChange}/>
            </FormField>
            {this.state.operation === "add"
              ? <Button type = 'submit' onClick = {() => this.handleSubmit("add")}>Submit</Button>
              : <Button type = 'submit' onClick = {() => this.handleSubmit("update")}>Submit</Button>}
            <Button type = 'cancel' onClick = {() => this.handleCancel(false)}>Cancel</Button>
          </Form>
        </Modal>
      );
    } else if (this.state.operation === "show" || this.state.operation === "delete") {
      return (
        <Modal style = {{padding: '20px'}} open = {this.state.open} 
        onClose = {() => this.handleCancel(false)}>
          {this.state.operation === "delete" 
            ? <h3>Are you sure you want to delete this task?</h3>
            : <div>
                <Button floated = 'right' icon = 'window close' onClick = {() => this.handleCancel(false)}/>
              </div>}
          <div style = {{overflowWrap: 'break-word' }}>
            <h3>Task Title: {this.state.task}</h3>
            <p><b>Category: </b>{this.state.category}</p>
            <p><b>Description: </b>{this.state.description}</p>
          </div>
          {this.state.operation === "delete" 
            ? <div>
                <Grid>
                  <GridColumn textAlign="center">
                    <Button type = 'yes' onClick = {this.handleDelete}>Yes</Button>
                    <Button type = 'no' onClick = {() => this.handleCancel(false)}>No</Button>
                  </GridColumn>
                </Grid>
              </div>
            : <div>
                <Grid>
                  <GridColumn textAlign="center">
                    <Button type = 'edit' onClick = {() => this.props.updateOpen(this.props.popup.task)}>
                      <Icon name = 'edit'></Icon>Edit
                    </Button>
                  </GridColumn>
                </Grid>
              </div>}
          
        </Modal>
      )

    } else {
      return null;
    }
  }

  handleChange = (e, data) => {
    this.setState({
      [data.name]: data.value
    });
  }

  handleAddition = (e, { value }) => {
    this.setState((oldState) => ({
      categories: [{ text: value, value }, ...oldState.categories],
    }));
  }

  clearState = () => {
    this.setState({
      task: "",
      category: "",
      description: "",
    });
  }

  // calls props to addTask and close popup
  // clears task, category and description
  handleSubmit = (op) => {
    if (op === "add") {
      this.props.addTask(this.state.task, this.state.category, this.state.description);
      this.clearState();
      this.props.closePopup();
    } else {
      this.props.updateTask({
        id: this.props.popup.task.id,
        title: this.state.task, 
        category: this.state.category, 
        description: this.state.description});
      this.clearState();
      this.props.closePopup();
    }
  }

  handleCancel = (keepState) => {
    if (!keepState) {
      this.clearState();
    }
    this.props.closePopup();
  }

  handleDelete = () => {
    this.props.deleteTask(this.props.popup.task);
    this.clearState();
    this.props.closePopup();
  }
}

export default Popup;