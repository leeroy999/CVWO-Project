import React from "react"
import { Menu, Icon, MenuItem, Dropdown, Sticky } from 'semantic-ui-react'

class Header extends React.Component {

    state = {
        categories : [], // array of category objects: for Dropdown categories for category filtering {key: i, text: category, value: i}
    }
    
    // updates categories state if props have change in length or change in categories
    componentDidUpdate(){
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

    // Header menu render
    // Layout: Task Manager (clickable -> links to '/') | Categories dropdown | Add Task button
    render () {
        return (
            <Sticky>
                <Menu color = 'purple' inverted stackable>
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
            </Sticky>
            
        );
    }

    // Handler for change in category dropdown selection
    handleChange = (e, {value}) => {
        if (Number.isInteger(value)) {
            const category = this.state.categories[value].text;
            this.props.handleCategory(category);
        } else {
            this.props.handleCategory("");
        }
    }

    // method to check if arr1 elements and obj2 keys are the same
    // Parameters: (Array, Object)
    // Return: Boolean
    keyEqual = (arr1, obj2) => {
        let bool = true;
        for (let i = 0; i < arr1.length; i++) {
            if (!obj2[arr1[i].text]) {
                bool = false;
            }
        }
        return bool;
    }
}

export default Header;
