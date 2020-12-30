import React from "react"
import PropTypes from "prop-types"
import Body from "./Body"

class App extends React.Component {
  render () {
    return (
      <div>
        <h2>Header goes here.</h2>
        <Body />
        <h2>Footer goes here</h2>
      </div>
    );
  }
}

export default App;
