import React from "react";
import styled from 'styled-components'
import { useTable, useResizeColumns, useFlexLayout } from 'react-table'

const Styles = styled.div`
  padding: 1rem;

  .table {
    ${'' /* These styles are suggested for the table fill all available space in its containing element */}
    display: block;
    ${'' /* These styles are required for a horizontaly scrollable table overflow */}
    overflow: auto;

    border-spacing: 0;
    border: 1px solid black;

    .thead {
      ${'' /* These styles are required for a scrollable body to align with the header properly */}
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tbody {
      ${'' /* These styles are required for a scrollable table body */}
      overflow-y: scroll;
      overflow-x: hidden;
      height: 500px;
    }

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      ${'' /* In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`

function ReactTable({ columns, data }) {

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,

  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useResizeColumns,
    useFlexLayout
  )

  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
                {/* Use column.getResizerProps to hook up the events correctly */}
                <div
                  {...column.getResizerProps()}
                  className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()} className="tbody">
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <div {...row.getRowProps()} className="tr">
              {row.cells.map(cell => {
                return (
                  <div {...cell.getCellProps()} className="td">
                    {cell.render('Cell')}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}


function Table({data}) {

  const columns = React.useMemo(
    () => [ 
          {
            Header: '序号',
            accessor: 'id',
          },
          {
            Header: '产品ID',
            accessor: 'item_id',
          },
          {
            Header: '品牌',
            accessor: 'brand',
          },
          {
            Header: '品牌',
            accessor: 'brand',
          },{
            Header: '单价',
            accessor: 'unit_price',
          },{
            Header: '总价',
            accessor: 'total_price',
          },{
            Header: '数量',
            accessor: 'quantity',
          },{
            Header: '规格',
            accessor: 'specification',
          },{
            Header: '质量',
            accessor: 'quality',
          },{
            Header: '供应商',
            accessor: 'vendor',
          },{
            Header: '经手人',
            accessor: 'agent',
          },{
            Header: '有无发票',
            accessor: 'receipt_bool',
          },{
            Header: '创建时间',
            accessor: 'created_date',
          },{
            Header: '更新时间',
            accessor: 'updated_date',
          },{
            Header: 'Edit',
            accessor: '[row identifier to be passed to button]',
            Cell: ({value}) => (<button>Edit</button>)
          },
          {
            Header: 'Delete',
            accessor: '[row identifier to be passed to button]',
            Cell: ({value}) => (<button>Delete</button>)
          },
        ],
      []
  )
  
  return (
    <Styles>
          <ReactTable
            data={data}
            columns={columns} 
          />
    </Styles>
  )
}

export default Table;