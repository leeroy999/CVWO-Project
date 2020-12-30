import React from "react"
import PropTypes from "prop-types"
import Show from "./Show"

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    };
  }

  componentDidMount(){
    fetch('/api/v1/tasks.json')
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ tasks: data }) });
  }

  render () {
    return (
      <Show tasks={this.state.tasks}/>
    );
  }
}

export default Body;
