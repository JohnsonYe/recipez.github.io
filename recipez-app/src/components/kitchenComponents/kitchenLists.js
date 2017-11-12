/**
 * Title: kitchenLists.js
 * Author: Vivian Lam
 * Date Created: 11/12/2017
 * Description: This file will serve as an abstract class for all
 * the lists in kitchen.
 */
import React, { Component } from 'react';
import axios from 'axios';

const Title = ({todoCount}) => {
    return (
        <div>
            <div>
                <h3> Items: ({todoCount})</h3>
            </div>
        </div>
    );
}

// Adding to the list, aka the add bar
const TodoForm = ({addTodo}) => {

    // Input Tracker
    let input;

    return (

        // Add to the form
        <form onSubmit={(e) => {
            e.preventDefault();

            // Preventing empty answers
            if( input.value != '') {
                addTodo(input.value);

                // Clearing
                input.value = '';
            }
            }}>

            <div class="input-group">
                <input className="form-control col-md-12" ref={node => {
                    input = node;
                }} />

                <button class="add" type="submit" id="add">
                Add
                <span></span>
                </button>
            </div>
        </form>
    );
};

const Todo = ({todo, remove}) => {

    // Each Todo
    return (

        <div className="form-control col-md-12">

        {todo.text}
        <button id="remove" type="submit" onClick={()=> remove(todo.id)}>
        X
        </button>
        </div>
    );
}

const TodoList = ({todos, remove}) => {

    // Map through the todos
    const todoNode = todos.map((todo) => {
        return (<Todo todo={todo} key={todo.id} remove={remove}/>)
    });
    return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

// Container Component
// Todo Id
window.id = 0;
class KitchenLists extends React.Component{

    constructor(props){
        // Pass props to parent class
        super(props);

        // Don't really need a constructor
    }

    // Lifecycle method
    componentDidMount(){
        // Make HTTP reques with Axios
        axios.get(this.apiUrl)
            .then((res) => {
            // Set state with result
            this.setState({data:res.data});
        });
    }

    // Add todo handler
    addTodo(val){
        // Assemble data
        const todo = {text: val}
        // Update data
        axios.post(this.apiUrl, todo)
            .then((res) => {
            this.state.data.push(res.data);
            this.setState({data: this.state.data});
        });
    }
    // Handle remove
    handleRemove(id){

        // Filter all todos except the one to be removed
        const remainder = this.state.data.filter((todo) => {
            if(todo.id !== id) return todo;
        });

        // Update state with filter
        axios.delete(this.apiUrl+'/'+id)
            .then((res) => {
            this.setState({data: remainder});
        })
    }

    render(){
        // Render JSX
        return (
            <div>
                <Title todoCount={this.state.data.length}/>
                <TodoForm addTodo={this.addTodo.bind(this)}/>
                <TodoList
                    todos={this.state.data}
                    remove={this.handleRemove.bind(this)}
                />
            </div>
        );
    }
}

export default KitchenLists;
