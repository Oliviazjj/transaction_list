import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";
import Modal from "./Modal"
import Table from "./Table"

class Home extends Component {
  state = {
    transactions: [],
    active_item: {
      item_id: "",
      name: "",
      brand: "",
      unit_price: 0,
      total_price: 0,
      quantity: 0,
      specification: "",
      quality: "",
      vendor: "",
      agent: "",
      receipt_bool: "",
    }
  };

  async componentDidMount() {
    this.refreshList()
  }

  refreshList = () => {
        axios
          .get(API_URL)
          .then(res => this.setState({ transactions: res.data }))
          .catch(err => console.log(err));
      };

  toggle = () => {
        this.setState({ modal: !this.state.modal });
      };

  createItem = () => {
        const item = {
            item_id: "",
            name: "",
            brand: "",
            unit_price: 0,
            total_price: 0,
            quantity: 0,
            specification: "",
            quality: "",
            vendor: "",
            agent: "",
            receipt_bool: ""
          };
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
  editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

  handleSubmit = item => {
    console.log("in handlesubmit");
    this.toggle();
    console.log("item is ", JSON.stringify(item));
    console.log("item id is ", item.id);
    if (item.id) {
      axios
        .put(`${API_URL}${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    console.log("item not exits, update");
    axios
      .post(API_URL, item)
      .then(res => this.refreshList());
  };
  handleDelete = item => {
    axios
      .delete(`${API_URL}${item.id}`)
      .then(res => this.refreshList());
  };

  renderItems = () => {
        return (
          <Table data={this.state.transactions} />
        );
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

export default Home;