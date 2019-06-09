import React, {Component} from 'react';

import BootstrapTable, {TableHeaderColumn} from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { ColumnToggle, Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import overlayFactory from 'react-bootstrap-table2-overlay';
import filterFactory, { textFilter, selectFilter, numberFilter, Comparator, multiSelectFilter } from 'react-bootstrap-table2-filter';



const products = [{'id': 0, 'name': 'name1', 'price': 0.5, 'quality': 0}, {'id': 1, 'name': 'name2', 'price': 5.5, 'quality': 1}, {'id': 2, 'name': 'name3', 'price': 2.5, 'quality': 0}];

const quality_selectOptions = {
  0: 'good',
  1: 'bad',
  2: 'unknown'
};

const specification_selectOptions = {
	0: '平米',
  1: '立方米',
  2: '未知'
};

const receipt_selectOptions = {
	0: '有',
  1: '无',
  2: '未知'
};

const columns = [{
  dataField: 'id',
  text: '产品ID',
	sort: true,
  filter: textFilter(),
}, {
  dataField: 'name',
  text: '商品名称',
	sort: true,
  filter: textFilter(),
}, {
  dataField: 'brand',
  text: '品牌',
	sort: true,
  filter: textFilter(),
}, {
  dataField: 'unit_price',
  text: '单价',
	sort: true,
  filter: numberFilter(),
defaultValue: { number: 0, comparator: Comparator.GT },
  headerFormatter: priceFormatter
}, {
  dataField: 'total_price',
  text: '总价',
	sort: true,
  filter: numberFilter(),
defaultValue: { number: 0, comparator: Comparator.GT },
  headerFormatter: priceFormatter
}, {
  dataField: 'specification',
  text: '产品规格',
  formatter: cell => specification_selectOptions[cell],
  filter: selectFilter({
    options: specification_selectOptions,
  })
}, {
  dataField: 'quality',
  text: '产品质量',
  formatter: cell => quality_selectOptions[cell],
  filter: multiSelectFilter({
    options: quality_selectOptions,
//	  defaultValue: [0, 2]
  })
}, {
  dataField: 'vendor',
  text: '供货商',
	sort: true,
  filter: textFilter(),
}, {
  dataField: 'agent',
  text: '经手人',
	sort: true,
  filter: textFilter(),
}, {
  dataField: 'receipt_bool',
  text: '有无发票',
  formatter: cell => receipt_selectOptions[cell],
  filter: selectFilter({
    options: receipt_selectOptions
  })
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

class Table extends React.Component {
  render() {
    return (
		<ToolkitProvider
			bootstrap4={ true }
			keyField='id' 
			striped
			hover
			condensed
			data={ products } 
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
//			expandRow={ expandRow }
			defaultSorted={ defaultSorted } 
			search
		>
		{
			props => (
				<div>
				<h3>Toggle columns below:</h3>
				<ToggleList { ...props.columnToggleProps } />
				<SearchBar { ...props.searchProps } />
				<ClearSearchButton { ...props.searchProps } />
				<ExportCSVButton { ...props.csvProps }>Export CSV!!</ExportCSVButton>
				<hr />
		  		<BootstrapTable 
					{ ...props.baseProps }
				/>
				</div>
			)
		}

     	</ToolkitProvider>
    );
  }
}

export default Table