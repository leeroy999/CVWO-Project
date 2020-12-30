import React from "react"
import PropTypes from "prop-types"

const Show = (props) => {
  var tasks = props.tasks.map(
    (task) => {
      return (
        <div key={task.id}>
          <h3>Task {task.id}: {task.title}</h3>
          <h4>Description: {task.description}</h4>
        </div>
      );
    }
  )

  return (
    <div>
      {tasks}
    </div> 
  );
}

export default Show
