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
import ToolkitProvider, { Search, CSVExport, ColumnToggle } from 'react-bootstrap-table2-toolkit';
import { Confirm } from 'semantic-ui-react'

const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;
const { ToggleList } = ColumnToggle;

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

class ConfirmDialog extends React.Component {
  callback(action){
  	this.props.callback(action);
  }
  
  render(){
    return(
      <div className='dialog'>
        <div>{this.props.message}}</div>
        <button onClick={() => this.callback('yes')}>Yes</button>
        <button onClick={() => this.callback('no')}>No</button>
      </div>
    )
  }
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
      selected: [],
      showDialog: false,
      type: ''
    };
  }

  componentDidMount() {
    this.props.getTransactions();
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleSubmit = (item, type) => {
    console.log("in handlesubmit, item is", item)
    this.props.addTransaction(item, type)
    this.setState({ modal: false, type: '' });

  }

  createItem = () => {
    console.log("in createItem")
    this.state.activeItem = newItem;
    this.setState({ modal: true , type: 'add' });
  }

  editItem = (cell, row, rowIndex) => {
    console.log("in editItem row. row is ", row)
    this.state.activeItem = row;
    this.setState({ modal: true, type: 'edit' });
  }

  deleteItem = (cell, row, rowIndex) => {
    this.props.deleteTransaction(row.id)
  }

  deleteItems = () => {
    console.log("in this.deleteItems")
    this.state.selected.map((row_id) => {console.log("ready to delete ", row_id);this.props.deleteTransaction(row_id)})
  }

  actionsFormatter = (cell, row, enumObject, rowIndex) => {
    return (
        <div>
            <TiEdit type="button" color="Green" onClick={() => this.editItem(cell, row, rowIndex)} />
            <TiDelete type="button" color="Red" onClick={() => this.deleteItem(cell, row, rowIndex)} />
        </div>
    );
  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
    }
  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }

  handleConfirm = () => {
    this.deleteItems()
    this.setState({ showDialog: false })
  }
  handleCancel = () => {
    console.log("in handlecancel")
    this.setState({ showDialog: false })
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
          },
        ]
      
      const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        style: { backgroundColor: '#c8e6c9' },
        onSelect: this.handleOnSelect,
        onSelectAll: this.handleOnSelectAll
      };

    return (
      <Fragment> 
        <div id="modal">
          {this.state.modal ? 
          (<AddTransactionModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
            type={this.state.type}
          />) : (null)}
        </div>
        <div id="dialog">
        {
            this.state.showDialog ? 
            (<Confirm
            open={this.state.showDialog}
            content="确定要删除选定的记录吗?"
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            />) : (null)}
        </div>
          <ToolkitProvider
            keyField="id"
            data={ this.props.transactions } 
            columns={ columns } 
            search
            columnToggle
            exportCSV
          >
             {
              props => (
                <div>
                  <div class="row">
                    <div class="col-md-4">
                    <ExportCSVButton { ...props.csvProps } className="text-light btn bg-success rounded control_btn">导出</ExportCSVButton>
                    <Button onClick={() => this.createItem()} style={{backgroundColor: "Purple"}} className="btn text-light rounded control_btn">添加</Button>
                    <Button id="deleteMultipleBtn" onClick={() => this.setState({showDialog: true})} style={{backgroundColor: "Orange"}} className="btn text-light rounded control_btn" disabled={this.state.selected.length===0}>删除</Button>
                    </div>
                    <div class="col-md-6" style={{display: "inline-flex"}}>
                      <SearchBar { ...props.searchProps }  
                        placeholder="请输入关键字..."
                        style={{ height: "40px"}} />
                      <ClearSearchButton { ...props.searchProps } 
                        text="清除" 
                        style={{
                        height: "40px", 
                      }}/>
                    </div>
                  </div>
                  <hr />
                  <ToggleList { ...props.columnToggleProps } />
                  <hr />
                  <BootstrapTable
                    { ...props.baseProps }
                    filter={ filterFactory() } 
                    hover
                    condensed
                    noDataIndication="0条记录"
                    selectRow={ selectRow }
                  />
                </div>
              )
            }
          </ToolkitProvider>
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  transactions: state.transactions.transactions //state.transactions is reducer defined in reducer/index.js. it means transactions of the transaction reducer
});

export default connect(mapStateToProps, { getTransactions, deleteTransaction, addTransaction })(Transactions);