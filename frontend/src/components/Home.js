import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";
import Modal from "./Modal"
// import Table from "./Table"
import Transactions from "./transactions/Transactions"

class Home extends Component {

  render() {
        return (
          <main className="content">
            <div className="row">
              <Transactions />
            </div>
          </main>
        );
      }
}

export default Home;