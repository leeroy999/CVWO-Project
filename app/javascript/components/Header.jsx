import React from "react"
import { Menu, Icon, MenuItem, Dropdown } from 'semantic-ui-react'

class Header extends React.Component {

    state = {
        categories : [],
    }
    
    componentDidUpdate(prevProps){
        if (Object.keys(this.props.categories).length !== Object.keys(this.state.categories).length
            || !this.keyEqual(this.state.categories, this.props.categories)){
            const options = [];
            Object.keys(this.props.categories).map((category, i) => {
                options.push({key: i, text: category, value: i});
            })
            this.setState({
                categories: options
            });
        }
    }

    render () {
        return (
            <Menu color = 'purple' fixed = 'top' inverted >
              <MenuItem as='h3' header >
                <a href = '/' >
                  <Icon name = 'tasks' />Task Manager
                </a>
              </MenuItem>
              <MenuItem position = 'left'>
              <Dropdown placeholder = "Category" 
                selectOnBlur = {false}
                options={this.state.categories} 
                position = "left" search clearable selection 
                onChange = {this.handleChange}/>
              </MenuItem>
              <MenuItem as = 'h3' position = 'right' header 
                link onClick = {this.props.addOpen}>
                <Icon name = 'plus circle' />Add Task
              </MenuItem>
            </Menu>
        );
    }

    handleChange = (e, {value}) => {
        if (Number.isInteger(value)) {
            const category = this.state.categories[value].text;
            this.props.handleCategory(category);
        } else {
            this.props.handleCategory("");
        }
    }

    keyEqual = (arr1, obj2) => {
        let bool = true;
        for (let i = 0; i < arr1.length; i++) {
            if (!obj2[arr1[i].text]) {
                console.log(arr1[i].text)
                bool = false;
            }
        }
        return bool;
    }
}

export default Header;
