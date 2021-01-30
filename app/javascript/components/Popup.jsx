import React from "react"
import { Modal, Form, FormField, TextArea, Input, Button, Dropdown, Icon, Grid, GridColumn} from "semantic-ui-react";

class Popup extends React.Component {

  state = {
    open: false, // controls whether Modal is open or close
    operation: "", // type of operation controls type of modal shown: "add", "update", "show", "delete"
    task: "", // task title (if any) to be shown in Modal
    category: "", // category (if any) to be shown in Modal
    description: "", // description (if any) to be shown in Modal
    categories: [] // array of category objects: for Dropdown categories for category filtering. {text: category, value: category}
  }

  // updates state when props change
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

  // renders different Modal for different popup operations: add, update, show, delete
  render() {
    if (this.state.operation === "add" || this.state.operation === "update") {
      // "add" and "update" creates a form with inputs: Task Title, Category and Description
      return (
        <Modal closeIcon closeOnDimmerClick = {false}
          open = {this.state.open}
          onClose = {this.handleCancel}>
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
            <Button type = 'submit' onClick = {() => this.handleSubmit(this.state.operation)}>Submit</Button>
            <Button type = 'cancel' onClick = {this.handleCancel}>Cancel</Button>
          </Form>
        </Modal>
      );
    } else if (this.state.operation === "show" || this.state.operation === "delete") {
      /* 
        "show" and "delete" creates a popup prompt with the details of the task, as well as button actions:
          - show: Edit, Delete, or Cancel(Close Icon on top right corner)
          - delete: Yes or No (cancels deletion of task)
      */
      return (
        <Modal closeIcon closeOnDimmerClick = {false}
          open = {this.state.open}
          onClose = {this.handleCancel}>
          {this.state.operation === "delete" 
            ? <Modal.Header style = {{color: 'maroon', textAlign: 'center'}}>Are you sure you want to delete this task?</Modal.Header>
            : <div></div>}
          <Modal.Content style = {{overflowWrap: 'break-word' }}>
            <h3>Task Title: {this.state.task}</h3>
            <p><b>Category: </b>{this.state.category}</p>
            <p><b>Description: </b>{this.state.description}</p>
          </Modal.Content>
          {this.state.operation === "delete" 
            ? <Modal.Actions>
                <Grid>
                  <GridColumn textAlign="center">
                    <Button type = 'yes' onClick = {this.handleDelete}>Yes</Button>
                    <Button type = 'no' onClick = {this.handleCancel}>No</Button>
                  </GridColumn>
                </Grid>
              </Modal.Actions>
            : <Modal.Actions>
                <Grid>
                  <GridColumn textAlign="center">
                    <Button type = 'edit' onClick = {() => this.props.updateOpen(this.props.popup.task)}>
                      <Icon name = 'edit'></Icon>Edit
                    </Button>
                    <Button type = 'delete' onClick = {() => this.props.deleteOpen(this.props.popup.task)}>
                      <Icon name = 'trash alternate'></Icon>Delete
                    </Button>
                  </GridColumn>
                </Grid>
              </Modal.Actions>}
        </Modal>
      )
    } else {
      // ERROR
      return null;
    }
  }

  // Removes all input by user
  // state changes: task, category, description
  clearState = () => {
    this.setState({
      task: "",
      category: "",
      description: "",
    });
  }

  // Handler for input changes in form, under "add" and "update" operations
  // state changes: task, category, description
  handleChange = (e, data) => {
    this.setState({
      [data.name]: data.value
    });
  }

  // Handler for adding new categories for dropdown in form, under "add" and "update" operations
  handleAddition = (e, { value }) => {
    this.setState((oldState) => ({
      categories: [{ text: value, value }, ...oldState.categories],
    }));
  }

  // Handler for submitting form, under "add" and "update" operations. Clears state and closes Modal after operations.
  handleSubmit = (op) => {
    if (op === "add") {
      this.props.addTask(this.state.task, this.state.category, this.state.description);
      this.clearState();
      this.props.closePopup();
    } else if (op === "update"){
      /*
        updateTask Parameters:
          task: updated fields in the form, namely the TASK TITLE, CATEGORY, and DESCRIPTION. Includes ID. --> Object
          prevCategory: previous category before it was updated --> String
          isInCategories: checks if the updated category was part of the list of categories. Returns truthy/falsy value. --> Integer/undefined
          isSameCategory: checks if the updated category is the same is the previous caregory. --> Boolean
      */
      this.props.updateTask({
        id: this.props.popup.task.id,
        title: this.state.task, 
        category: this.state.category, 
        description: this.state.description},
        this.props.popup.task.category,
        this.props.categories[this.state.category],
        this.props.popup.task.category === this.state.category);
      this.clearState();
      this.props.closePopup();
    } else {
      // ERROR
    }
  }

  // Handler for cancelling or closing of Modal
  handleCancel = () => {
    this.clearState();
    this.props.closePopup();
  }

  // Handler for deleting task
  handleDelete = () => {
    this.props.deleteTask(this.props.popup.task);
    this.clearState();
    this.props.closePopup();
  }
}

export default Popup;