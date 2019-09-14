import React, {Component} from 'react';
import axios from "axios";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./components/Modal";

import BootstrapTable, {TableHeaderColumn} from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { ColumnToggle, Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import overlayFactory from 'react-bootstrap-table2-overlay';
import filterFactory, { textFilter, selectFilter, numberFilter, Comparator, multiSelectFilter, dateFilter } from 'react-bootstrap-table2-filter';
import {quality_selectOptions, specification_selectOptions, receipt_selectOptions} from "./constants";

const transactionItems = [{'id': 0, 'name': 'name1', 'price': 0.5, 'quality': 0}, {'id': 1, 'name': 'name2', 'price': 5.5, 'quality': 1}, {'id': 2, 'name': 'name3', 'price': 2.5, 'quality': 0}];

const handleModelEdit = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

const actionsFormatter = (cell, row, rowIndex, formatExtraData) => { 
     return (
         <div>
             <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm" onClick={handleModelEdit}>
                 Edit
             </button>
             <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-buttom" size="sm">
                 Delete
             </button>
         </div>
     );
 }

const columns = [{
  dataField: 'item_id',
  text: '产品ID',
  sort: true,
  headerStyle: () => {
      return { width: "90px" };
    }
  // filter: textFilter(),
}, {
  dataField: 'name',
  text: '商品名称',
	sort: true,
  // filter: textFilter(),
}, {
  dataField: 'brand',
  text: '品牌',
	sort: true,
  // filter: textFilter(),
}, {
  dataField: 'unit_price',
  text: '单价',
	sort: true,
  // filter: numberFilter(),
  defaultValue: { number: 0, comparator: Comparator.GT },
  headerFormatter: priceFormatter
}, {
  dataField: 'total_price',
  text: '总价',
	sort: true,
  // filter: numberFilter(),
defaultValue: { number: 0, comparator: Comparator.GT },
  headerFormatter: priceFormatter
}, {
  dataField: 'specification',
  text: '产品规格',
  formatter: cell => specification_selectOptions[cell],
  // filter: selectFilter({
  //   options: specification_selectOptions,
  // })
}, {
  dataField: 'quality',
  text: '产品质量',
  formatter: cell => quality_selectOptions[cell],
//   filter: multiSelectFilter({
//     options: quality_selectOptions,
// //	  defaultValue: [0, 2]
//   })
}, {
  dataField: 'vendor',
  text: '供货商',
	sort: true,
  // filter: textFilter(),
}, {
  dataField: 'agent',
  text: '经手人',
	sort: true,
  // filter: textFilter(),
}, {
  dataField: 'receipt_bool',
  text: '有无发票',
  formatter: cell => receipt_selectOptions[cell],
  // filter: selectFilter({
  //   options: receipt_selectOptions
  // })
}, {
  dataField: 'created_date',
  text: '创建日期',
  formatter: cell => receipt_selectOptions[cell],
  // filter: dateFilter()
}, {
    dataField: 'actions',
    text: '控制',
    isDummyField: true,
    csvExport: false,
    formatter: actionsFormatter,
  }];


const rowEvents = {
  onClick: (e, row, rowIndex) => {
    console.log(`clicked on row with index: ${rowIndex}`);
  },
  onMouseEnter: (e, row, rowIndex) => {
    console.log(`enter on row with index: ${rowIndex}`);
  }
};

const defaultSorted = [{
  dataField: 'name',
  order: 'desc'
}];

const CaptionElement = () => <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'purple', border: '1px solid purple', padding: '0.5em' }}>凯盛目录</h3>;

const { ToggleList } = ColumnToggle;

const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

function priceFormatter(column, colIndex, { sortElement, filterElement }) {
  return (
    <div style={ { display: 'flex', flexDirection: 'column' } }>
      { filterElement }
      { column.text }
      { sortElement }
    </div>
  );
}

const MySearch = (props) => {
  let input;
  const handleClick = () => {
    props.onSearch(input.value);
  };
  return (
    <div className="row search_field">
      <div className="centered-label">
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <input
        className="search_bar"
        placeholder="搜索"
        style={ { backgroundColor: 'white' } }
        ref={ n => input = n }
        type="text"
        onChange={ handleClick }
      />
    </div>
  );
};

const MyExportCSV = (props) => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <div>
      <button className="btn btn-success" onClick={ handleClick }>下载CSV</button>
    </div>
  );
};

class Table extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      activeItem: {
            item_id: "",
            name: "",
            brand: "",
            unit_price: 0,
            total_price: 0,
            specification: "",
            quality: "",
            vendor: "",
            agent: "",
            receipt_bool: false,
            created_date: ""
          },
      transactionList: []
    };
    this.actionsFormatter= actionsFormatter.bind(this);
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios
      .get("http://localhost:8000/api/transactions/")
      .then(res => this.setState({ transactionList: res.data }))
      .catch(err => console.log(err));
  };

  toggle = () => {
        this.setState({ modal: !this.state.modal });
      };
  handleSubmit = item => {
    console.log("in handlesubmit");
    this.toggle();
    console.log("item is ", JSON.stringify(item));
    console.log("item id is ", item.id);
    if (item.id) {
      console.log("item exits, update");
      axios
        .put(`http://localhost:8000/api/transactions/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    console.log("item not exits, update");
    axios
      .post("http://localhost:8000/api/transactions/", item)
      .then(res => this.refreshList());
  };
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/transactions/${item.id}`)
      .then(res => this.refreshList());
  };
  createItem = () => {
        const item = {
            item_id: "",
            name: "",
            brand: "",
            unit_price: 0,
            total_price: 0,
            specification: "",
            quality: "",
            vendor: "",
            agent: "",
            receipt_bool: false,
            created_date: ""
          };
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
  editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

  render() {
    return (
		<ToolkitProvider
			bootstrap4={ true }
			keyField='id' 
			striped
			hover
			condensed
			data={ this.state.transactionList } 
			columns={ columns }
			columnToggle
			loading={ true }  //only loading is true, react-bootstrap-table will render overlay
			overlay={ overlayFactory() }
			rowEvents={ rowEvents }	
			caption={<CaptionElement />}
			noDataIndication="Table is Empty"
			filter={ filterFactory() }
			pagination={ paginationFactory() }
			selectRow={ { mode: 'checkbox', clickToSelect: true } }
			tabIndexCell
			defaultSorted={ defaultSorted } 
			search
		>
		{
			props => (
				<main className="content">
          <div className="row">
            <div className="col-md-9">
              <h1 className="text-gray text-uppercase text-center my-4">交易列表</h1>
            </div>
            <div className="float-right centered-label">
                <button className="btn btn-success btn_control" onClick={this.createItem}>添加</button>
            </div>
            <div className="float-right centered-label">
                <button className="btn btn-success btn_control">上传CSV</button>
            </div>
            <div className="float-right centered-label">
                <MyExportCSV { ...props.csvProps } />
            </div>
          </div>
          <div className="transaction_list">
            
            <div>
              <MySearch { ...props.searchProps } />
            </div>
            <div className="row">
              <h3 className="col-md-2">显示/隐藏:</h3>
              <ToggleList { ...props.columnToggleProps } />
            </div>
    				
    				<hr />
  		  		<BootstrapTable 
  					{ ...props.baseProps }
    				/>
          </div>
          {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
              />
            ) : null}
				</main>
			)
		}

     	</ToolkitProvider>
    );
  }
}

export default Table