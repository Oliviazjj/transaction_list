import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTransactions, deleteTransaction, addTransaction } from '../../actions/transactions';
import { Button, Table } from 'semantic-ui-react'
import AddTransactionModal from "../Modal.js"
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import {specification_selectOptions, receipt_selectOptions, quality_selectOptions } from "../../constants"
import { TiEdit, TiDelete } from "react-icons/ti";

const newItem = {
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
  receipt_bool: false,
  created_date: ""
}

export class Transactions extends Component {

  static propTypes = {
    transactions: PropTypes.array.isRequired,
    getTransactions: PropTypes.func.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    addTransaction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeItem: newItem,
      modal: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this)
    this.createItem = this.createItem.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  componentDidMount() {
    this.props.getTransactions();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleSubmit(item) {
    this.props.addTransaction(item)
    this.setState({ modal: false });

  }

  createItem () {
    console.log("in createItem")
    this.state.activeItem = newItem;
    this.setState({ modal: true });
  }

  editItem = (cell, row, rowIndex) => {
    this.state.activeItem = row;
    this.setState({ modal: true });
  }

  deleteItem = (cell, row, rowIndex) => {
    this.props.deleteTransaction(row.id)
  }

  actionsFormatter = (cell, row, enumObject, rowIndex) => {
    return (
        <div>
            <TiEdit type="button" color="Green" onClick={() => this.editItem(cell, row, rowIndex)} />
            <TiDelete type="button" color="Red" onClick={() => this.deleteItem(cell, row, rowIndex)} />
        </div>
    );
}

  render() { 

    const columns = [ 
          {
            text: '序号',
            dataField: 'id',
            filter: textFilter(),
            sort: true,
          },
          {
            text: '产品ID',
            dataField: 'item_id',
            filter: textFilter(),
            sort: true
          },
          {
            text: '名称',
            dataField: 'name',
            filter: textFilter(),
            sort: true
          },
          {
            text: '品牌',
            dataField: 'brand',
            sort: true
          },{
            text: '单价',
            dataField: 'unit_price',
            sort: true
            // Filter: NumberRangeColumnFilter,
            // filter: 'between',
          },{
            text: '总价',
            dataField: 'total_price',
            sort: true
            /*Filter: SliderColumnFilter,
            filter: filterGreaterThan,*/
          },{
            text: '数量',
            dataField: 'quantity',
            sort: true
            /*Filter: SliderColumnFilter,
            filter: filterGreaterThan,*/
          },{
            text: '规格',
            dataField: 'specification',
            sort: true
            // filter: selectFilter({
            //   options: specification_selectOptions,
            //   defaultValue: 2
            // })
          },{
            text: '质量',
            dataField: 'quality',
            sort: true
            // filter: selectFilter({
            //   options: quality_selectOptions,
            //   defaultValue: 2
            // })
          },{
            text: '供应商',
            dataField: 'vendor',
            sort: true
          },{
            text: '经手人',
            dataField: 'agent',
            sort: true
          },{
            text: '有无发票',
            dataField: 'receipt_bool',
            sort: true
            // filter: selectFilter({
            //   options: receipt_selectOptions,
            //   defaultValue: 2
            // })
          },{
            text: '创建时间',
            dataField: 'created_date',
            sort: true
          },{
            text: '更新时间',
            dataField: 'updated_date',
            sort: true
          },{
            text: '控制',
            dataField: 'controls',
            isDummyField: true,
            csvExport: false,
            formatter: this.actionsFormatter.bind(this),
            // Cell: (cell) => (
            //   <div style={{display: 'inline-block'}}>
            //     <button onClick={() => {
                  
            //     }}>Edit</button>
            //     <button onClick={() => {
                  
            //     }}>Delete</button>
            //   </div>
            // )
          },
        ]


    return (
      <Fragment> 
        <div><Button onClick={() => this.createItem()}>Add</Button></div>
        <div>
          {this.state.modal ? 
          (<AddTransactionModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />) : (null)}
        </div>
          <h2> transactions </h2>
          <BootstrapTable 
            keyField='id' 
            data={ this.props.transactions } 
            columns={ columns } 
            filter={ filterFactory() } 
            hover
            noDataIndication="0条记录"
            />
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  transactions: state.transactions.transactions //state.transactions is reducer defined in reducer/index.js. it means transactions of the transaction reducer
});

export default connect(mapStateToProps, { getTransactions, deleteTransaction, addTransaction })(Transactions);