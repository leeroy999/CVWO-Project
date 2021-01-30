// Development command: foreman start

import React from "react"
import Body from "./Body"
import Header from "./Header"
import Popup from "./Popup"

class App extends React.Component {

  state = {
    tasks: [], // array of task objects, from tasks API
    categories: {}, // object {key: category, value: number of tasks in category}
    category: "", // category in Header component, for filtering purpose
    popup: {open: false, operation: "", task: []} // object passed into props of Popup component
  }

  // After component mounts, fetches data from API and set it as state for (tasks) and (categories)
  componentDidMount(){
    fetch('/api/v1/tasks.json')
      .then((response) => {return response.json();})
      .then((data) => {
        const categories = {};
        data.map((task) => {
          categories[task.category] = categories[task.category]
            ? categories[task.category] + 1
            : 1;
        });
        this.setState({ 
          tasks: data,
          categories: categories
        });
      })
      .catch((error) => {
        alert(error);
      });
  }

  render () {
    return (
      <div>
        <Header categories = {this.state.categories} 
          addOpen = {() => this.handlePopup(true, "add", [])}
          handleCategory = {this.handleCategory}/>
          <Body tasks = {this.state.tasks} 
            deleteOpen = {(task) => this.handlePopup(true, "delete", task)}
            updateOpen = {(task) => this.handlePopup(true, "update", task)}
            showOpen = {(task) => this.handlePopup(true, "show", task)}
            category = {this.state.category}/>
          <Popup popup = {this.state.popup} 
            closePopup = {() => this.handlePopup(false, "", [])}
            addTask = {this.addTask}
            deleteTask = {this.deleteTask}
            updateTask = {this.updateTask}
            updateOpen = {(task) => this.handlePopup(true, "update", task)}
            deleteOpen = {(task) => this.handlePopup(true, "delete", task)}
            categories = {this.state.categories} />
      </div>
    );
  }

  // Setter for (category) state, for use to filter categories in Body component
  // Parameters: cat --> String
  handleCategory = (cat) => {
    this.setState({
      category: cat
    });
  }

  // Setter for (popup) state, for use in Popup component
  /* Parameters:
      open: toggles opening of the Modal in Popup component --> Boolean
      operation: changes the type of form to be opened by the Modal in Popup component --> String
        --> CRUD OPERATIONS: (add, show, update, delete)
      task: sets the fields in the form, namely the TASK TITLE, CATEGORY, and DESCRIPTION --> Object
  */
  handlePopup = (open, operation, task) => {
    this.setState({
      popup: {open: open, operation: operation, task: task}
    });
  }

  /* Create task by 
    - adding it to tasks API via POST method
    - adding it to (categories) and (tasks) state

    Parameters: 
      task --> String
      category --> String
      description --> String
  */
  addTask = (task, category, description) => {
    let body = JSON.stringify({task: {title: task, description: description, category: category}});
    fetch('/api/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }).then((response) => {return response.json();})
      .then((data) => {
        this.setState((oldState) => {
          const categories = oldState.categories;
          if (categories[category]) {
            categories[category] += 1;
          } else {
            categories[category] = 1;
          }
          return {
            tasks: oldState.tasks.concat(data), // new array created, results in re-render and componentDidUpdate in various components
            categories: categories
          };
        });
      })
      .catch((error) => alert(error));
  }

  /* Destroy task by:
    - deleting it from tasks API via DELETE method on the task.id
    - removing it from (tasks) and (categories) state

    Parameters:
      task --> Object
  */
  deleteTask = (task) => {
    fetch(`/api/v1/tasks/${task.id}`, 
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
        this.setState((oldState) => {
          // new tasks array created, results in re-render and componentDidUpdate in various components
          const tasks = oldState.tasks.filter((taskObj) => taskObj.id !== task.id);
          const categories = oldState.categories;
          if (categories[task.category] - 1 <= 0) {
            delete categories[task.category];
          } else {
            categories[task.category] -= 1;
          }
          return {
            tasks: tasks,
            categories: categories
          };
        })
      })
      .catch((error) => alert(error));
    
  }

  /* Update task by:
    - updating it in tasks API via PUT method on the task.id
    - updates it in (tasks) and (categories) state

    Parameters:
      task: updated fields in the form, namely the TASK TITLE, CATEGORY, and DESCRIPTION. Includes ID. --> Object
      prevCategory: previous category before it was updated --> String
      isInCategories: checks if the updated category was part of the list of categories. Returns truthy/falsy value. --> Integer/undefined
      isSameCategory: checks if the updated category is the same is the previous caregory. --> Boolean
  */
  updateTask = (task, prevCategory, isInCategories, isSameCategory) => {
    fetch(`api/v1/tasks/${task.id}`, 
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({task: task}),
    }).then(() => { 
      this.setState((oldState) => {
        task.updated_at = new Date();
        // new tasks array created, results in re-render and componentDidUpdate in various components
        let tasks = oldState.tasks.filter((t) => t.id !== task.id);
        let categories = oldState.categories;
        if (!isInCategories) {
          categories[task.category] = 1;
        } else if (!isSameCategory) {
          if (categories[prevCategory] - 1 <= 0) {
            delete categories[prevCategory];
          }
          categories[task.category] += 1;
        } else {}
        return ({
          tasks: tasks.concat([task]),
          categories: categories
        })
      });
    })
    .catch((error) => alert(error));
  }
}

export default App;
