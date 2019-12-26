import React from "react";
import styled from 'styled-components'
import { useTable, useResizeColumns, useFlexLayout, useSortBy, useFilters, useGlobalFilter, usePagination, useRowSelect } from 'react-table'
// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'
import axios from "axios";
import {pageSizeOptions, API_URL} from "../constants"
import Modal from "./Modal"

const Styles = styled.div`
  padding: 1rem;

  .table {
    ${'' /* These styles are suggested for the table fill all available space in its containing element */}
    display: block;
    ${'' /* These styles are required for a horizontaly scrollable table overflow */}
    overflow: auto;

    border-spacing: 0;
    border: 1px solid black;

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

      .pagination {
        padding: 0.5rem;
      }

      .pagination_container {
        margin-top: 20px;
        display: inline-flex;
      }
    }
  }
`

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <span>
      Search:{' '}
      <input
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val




function ReactTable({ 
  columns, 
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  tableState,
}) {

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      Filter: DefaultColumnFilter, //default filter UI
    }),
    []
  )

  // Use the useTable hook to create your table configuration
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

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize, tableState])


  return (
  <div>
    <div>
      <div>
        <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
        All
      </div>
      {flatColumns.map(column => (
        <div key={column.id}>
          <label>
            <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
            {column.id}
          </label>
        </div>
      ))}
      <br />
    </div>
    <div style={{ border: "1px solid black",}} className="tr">
      <div colSpan={flatColumns.length} style={{ textAlign: 'left',}} className="th">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </div>
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
                {/* Use column.getResizerProps to hook up the events correctly */}
                <div
                  {...column.getResizerProps()}
                  className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                />
                {/* Render the columns filter UI */}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()} className="tbody">
        {page.map((row, i) => {
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
        <tr>
          {loading ? (
            // Use our custom loading state to show a loading indicator
            <td colSpan="10000">Loading...</td>
          ) : (
            <td colSpan="10000">
              Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
              results
            </td>
          )}
        </tr>
      </div>
    </div>
    <div className="pagination_container">
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        {'<<'}
      </button>{' '}
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'<'}
      </button>{' '}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next Page
      </button>
      <div>
        Page{' '}
        <em>
          {pageIndex + 1} of {pageOptions.length}
        </em>
      </div>
      <div>Go to page:</div>
      <input
        type="number"
        defaultValue={pageIndex + 1 || 1}
        onChange={e => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0
          gotoPage(page)
        }}
      />
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        {'>'}
      </button>{' '}
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        {'>>'}
      </button>{' '}
      <select
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value))
       }}
      >
        {pageSizeOptions.map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
    <div>
      <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              'selectedFlatRows[].original': selectedFlatRows.map(
                d => d.original
              ),
            },
            null,
            2
          )}
        </code>
      </pre>
    </div>
  </div>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number

filterGreaterThan.autoRemove = val => typeof val !== 'number'


function Table() {

  const columns = React.useMemo(
    () => [ 
          {
            Header: '序号',
            accessor: 'id',
            sortType: 'basic'
          },
          {
            Header: '产品ID',
            accessor: 'item_id',
            sortType: 'basic',
            filter: 'fuzzyText',
          },
          {
            Header: '名称',
            accessor: 'name',
            sortType: 'basic'
          },
          {
            Header: '品牌',
            accessor: 'brand',
            sortType: 'basic'
          },{
            Header: '单价',
            accessor: 'unit_price',
            sortType: 'basic',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
          },{
            Header: '总价',
            accessor: 'total_price',
            sortType: 'basic',
            Filter: SliderColumnFilter,
            filter: filterGreaterThan,
          },{
            Header: '数量',
            accessor: 'quantity',
            sortType: 'basic',
            Filter: SliderColumnFilter,
            filter: filterGreaterThan,
          },{
            Header: '规格',
            accessor: 'specification',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },{
            Header: '质量',
            accessor: 'quality',
            Filter: SliderColumnFilter,
            filter: filterGreaterThan,
          },{
            Header: '供应商',
            accessor: 'vendor',
            sortType: 'basic'
          },{
            Header: '经手人',
            accessor: 'agent',
            sortType: 'basic'
          },{
            Header: '有无发票',
            accessor: 'receipt_bool',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },{
            Header: '创建时间',
            accessor: 'created_date',
            sortType: 'date'
          },{
            Header: '更新时间',
            accessor: 'updated_date',
            sortBy: 'date'
          },{
            Header: '控制',
            accessor: 'controls',
            Cell: (cell) => (
              <div style={{display: 'inline-block'}}>
                <button onClick={() => {
                  console.log("in editItem")
                  const item = cell.row.original
                  setActiveItem(item);
                  setModal(true);
                }}>Edit</button>
                <button onClick={() => {
                  axios
                  .delete(`${API_URL}${cell.row.original.id}`)
                  .then(res => {
                    let items = data.filter(item => cell.row.original.id != item.row.original.id);
                    setData(items);
                    setTableState('delete')
                  })
                  .catch(err => console.log(err));
                }}>Delete</button>
              </div>
            )
          },
        ],
      []
  )

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
        receipt_bool: ""
      }

  // We'll start our table without any data
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [pageCount, setPageCount] = React.useState(0)
  const [activeItem, setActiveItem] = React.useState(newItem)
  const [modal, setModal] = React.useState(false)
  const [tableState, setTableState] = React.useState("none")
  const fetchIdRef = React.useRef(0)

  function createItem () {
    console.log(" in createItem, modal is "+modal)
    setActiveItem(newItem);
    setModal(true);
    console.log(" after in createItem, modal is "+modal)
  }

  function editItem(item) {
    console.log("in editItem")
    setActiveItem(item);
    setModal(true);
  }

  function handleSubmit(item) {
    console.log("in handlesubmit");
    setModal(false);
    console.log("item is ", JSON.stringify(item));
    console.log("item id is ", item.id);
    if (item.id) {
      axios
        .put(`${API_URL}${item.id}/`, item)
        .then(res => setTableState('submit'))
        .catch(err => console.log(err));
      return;
    }
    console.log("item not exits, update");
    axios
      .post(API_URL, item)
      .then(res => setTableState('submit'))
      .catch(err => console.log(err));
  }






  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {

    console.log("fetch data")
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setLoading(true)

    setTimeout(() => {
          // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize
        axios
          .get(API_URL)
          .then(res => {
            setData(res.data.slice(startRow, endRow))
            setPageCount(Math.ceil(res.data.length / pageSize))
            setLoading(false)
            setTableState('none')
          })
          .catch(err => console.log(err));       
      }    
    }, 1000)
  }, [])

  const toggle = () => {
    setModal(!modal) 
  }
  
  return (
    <Styles>
      <div className="row top_control">
        <button className="btn btn-primary" onClick={createItem}> 
          Add transction
        </button>
      </div>
      <ReactTable
        data={data}
        columns={columns} 
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        tableState={tableState}
      />
      <div>
        {modal ? 
          (<Modal
            activeItem={activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />) : (null)
        }
      </div>
    </Styles>
  )
}

export default Table;