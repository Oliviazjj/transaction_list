import React from 'react';
import { connect } from 'react-redux';

class MyTable extends React.Component {
  render() {
    // console.log('MyTable render:',{props:this.props,state:this.state});
    const headComponentExample =
    {
      getTheadProps : () => {
        return {
          style: { color: 'blue' },
          monkey: 'yellow',
        }
      },
      TheadComponent: (props) => { 
        // console.log('TheadComponent props:',props);
        const { children, monkey, ...rest } = props;
        // return <div>nothing</div>;
        return (
          <div {...rest} >
            <div style={{backgroundColor:monkey}}>The {monkey} Monkey</div>
            {children}
          </div>
        );
      },
    };
    const extraProps =
    {
      // ...headComponentExample,
    }

    const instance = useTable(

      {
        columns,
        data,
        defaultColumn,
        filterTypes,
        initialState: { pageIndex: 0 }, // Pass our hoisted table state
        manualPagination: true, // Tell the usePagination
        // hook that we'll handle our own data fetching
        // This means we'll also have to provide our own
        // pageCount.
        pageCount: controlledPageCount,
  
      },
      useResizeColumns,
      useFlexLayout,
      useFilters, 
      useGlobalFilter,
      useSortBy,
      usePagination,
      useRowSelect,
      hooks => {
        hooks.flatColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ])
      }
    )

    // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    totalColumnsWidth,
    flatColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    pageOptions,
    pageCount,
    page,
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    setPageSize, 
    getToggleHideAllColumnsProps,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter},
  } = instance
  
    return (
      <div>
        <ReactTable
          data={this.props.data}
          columns={this.props.columns}
          defaultSorted={[{id:'id',desc:true}]}
          {...extraProps}
        />
      </div>
    );
  }
}

export default MyTable;