import Table from 'react-bootstrap/Table'

import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";

class Table extends Component {
  
  renderItems = () => {
  	return(
  			Table striped condensed hover>
  <thead>
    <tr>
      <th></th>
      <th>Name</th>
      <th>Address</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    {personArray.map(this.renderPerson)}
  </tbody>
</Table>
  		)
        return this.props.transactions.map(item => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span
              className={`todo-title mr-2 ${
                this.state.viewCompleted ? "completed-todo" : ""
              }`}
              title={item.description}
            >
              {item.title}
            </span>
            <span>
              <button
                onClick={() => this.editItem(item)}
                className="btn btn-secondary mr-2"
              >
                {" "}
                Edit{" "}
              </button>
              <button
                onClick={() => this.handleDelete(item)}
                className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </span>
          </li>
        ));
      };

  render() {
        return (
          <main className="content">
            <h1 className="text-white text-uppercase text-center my-4">KaiSheng</h1>
            <div className="row ">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  <div className="">
                    <button onClick={this.createItem} className="btn btn-primary">
                      Add transction
                    </button>
                  </div>
                  <ul className="list-group list-group-flush">
                    {this.renderItems()}
                  </ul>
                </div>
              </div>
            </div>
            {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
              />
            ) : null}
          </main>
        );
      }
}

export default Table;