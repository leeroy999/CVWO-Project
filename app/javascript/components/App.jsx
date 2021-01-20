// Development command: foreman start

import React from "react"
import Body from "./Body"
import Header from "./Header"
import Popup from "./Popup"

class App extends React.Component {

  state = {
    tasks: [],
    categories: {},
    category: "",
    popup: {open: false, operation: "", task: []}
  }

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
        <div style={{paddingTop: "60px"}}>
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
            categories = {this.state.categories} />
        </div>
      </div>
    );
  }

  handleCategory = (cat) => {
    this.setState({
      category: cat
    });
  }

  handlePopup = (open, operation, task) => {
    this.setState({
      popup: {open: open, operation: operation, task: task}
    });
  }

  // JSON: {title: task, category: category, description: description}
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
            tasks: oldState.tasks.concat(data),
            categories: categories
          };
        });
      })
      .catch((error) => alert(error));
  }

  deleteTask = (task) => {
    fetch(`/api/v1/tasks/${task.id}`, 
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
        this.setState((oldState) => {
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

  updateTask = (task) => {
    fetch(`api/v1/tasks/${task.id}`, 
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({task: task}),
    }).then(() => { 
      this.setState((oldState) => {
        const tasks = oldState.tasks;
        const categories = oldState.categories;
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].id === task.id) {
            tasks[i].title = task.title;
            tasks[i].description = task.description;
            if (tasks[i].category !== task.category) {
              if (categories[tasks[i].category] - 1 <= 0) {
                delete categories[tasks[i].category];
              } else {
                categories[tasks[i].category] -= 1;
              }
              if (categories[task.category]) {
                categories[task.category] += 1;
              } else {
                categories[task.category] = 1;
              }
            }
            tasks[i].category = task.category;
          }
        }
        return {
          tasks: tasks,
          categories: categories
        };
      });
    })
    .catch((error) => alert(error));
  }

}

export default App;
