import React, { useEffect } from "react";
import {
  useTable,
  usePagination,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import useUpdateDecision from "../Components/CustomHooks/useUpdateDecision";
import "./TableComponent.css";
import documentDownloadImage from "../Images/DocumentDownloadImage.png";
import { useDispatch, useSelector } from "react-redux";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const dispatch = useDispatch();

  const count = preGlobalFilteredRows.length;
  //const val = "";
  const [value, setValue] = React.useState(globalFilter);
  //setValue("");
  //console.log("Inside global filter: ",globalFilter);
  const onChange = useAsyncDebounce((value) => {
    dispatch({
      type: "UPDATE_SEARCH_STRING",
      payload: { searchString: value },
    });
    setGlobalFilter(value || undefined);
  }, 0);

  return (
    <>
      <span style={{ float: "left" }}>
        <div className="inputContainer">
          <label style={{ fontWeight: "bold" }}>Search:</label>
          <div>
            <input
              className="form-control"
              value={globalFilter || ""}
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} records...`}
            />
          </div>
        </div>
      </span>
    </>
  );
}

function Table({
  columns,
  data,
  makeLink,
  radioFlag,
  navigateToForm,
  handleCheckBoxChange,
  handleRadioChange,
  showCheckBox,
  downloadFile,
  isNavigated,
  fromComponent,
}) {
  const { printConsole } = useUpdateDecision();
  const dispatch = useDispatch();

  //printConsole("Inside table component show checkbox: ",makeLink);
  // Use the state and functions returned from useTable to build your UI
  const [isClick, setIsClick] = React.useState(false);

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;
    const handleSearch = (e) => {
      setFilter(e.target.value || undefined);

      if (e.target.value === "" || null) {
        setIsClick(false);
      } else {
        setIsClick(true);
      }
    };

    return (
      <input
        className="form-control"
        value={filterValue || ""}
        onChange={handleSearch}
        onBlur={() => {
          setIsClick(false);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }

  const defaultColumn = React.useMemo(
    () => ({
      // Default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    rows,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageSize: 5 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const savedDataHistory = useSelector(
    (store) => store.dashboardNavigationState,
  );

  useEffect(() => {
    if (fromComponent === "DashBoard")
      setTimeout(() => {
        gotoPage(savedDataHistory?.pageNumber);
        setGlobalFilter(savedDataHistory?.searchString);
      }, 1000);
  }, [isNavigated]);
  const handlePageNavigation = (pageNumber) => {
    gotoPage(pageNumber);
    dispatch({
      type: "UPDATE_PAGE_NUMBER",
      payload: { pageNumber },
    });
  };

  return (
    <div>
      <pre>
        <code>
          {/* {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage,
                        },
                        null,
                        2
                    )} */}
        </code>
      </pre>

      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <br />
      <table
        className="table table-bordered table-striped"
        {...getTableProps()}
        style={{ marginTop: "3%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {showCheckBox !== undefined && showCheckBox === true && <th></th>}
              {headerGroup.headers.map((column, i) => (
                <>
                  <th key={i}>
                    <span
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </span>
                    {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                  </th>
                </>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          <>
            {isClick
              ? rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={i}>
                      {row.cells.map((cell) => {
                        return (
                          <>
                            {showCheckBox !== undefined &&
                              showCheckBox === true && (
                                // <td>
                                //     <div class="form-check">
                                //         <input class="form-check-input" type="checkbox" onChange={((event)=>handleCheckBoxChange(event,row.id))} value="" id="caseCheckBox"
                                //         checked={false} />
                                //     </div>
                                // </td>
                                <td>
                                  {radioFlag !== undefined &&
                                  radioFlag === true ? (
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        onChange={(event) =>
                                          handleRadioChange(event, row.id)
                                        }
                                        value=""
                                        id="caseRadioDefault"
                                        checked={
                                          row.original.isChecked !== undefined
                                            ? row.original.isChecked
                                            : false
                                        }
                                      ></input>
                                    </div>
                                  ) : (
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        onChange={(event) =>
                                          handleCheckBoxChange(event, row.id)
                                        }
                                        value=""
                                        id="caseCheckBox"
                                        checked={
                                          row.original.isChecked !== undefined
                                            ? row.original.isChecked
                                            : false
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                              )}
                            if(cell.column.id === 'downloadFile')
                            {
                              (cell.column.Cell = (r) => {
                                return (
                                  <div>
                                    <img
                                      id="w9DocDownloadImage"
                                      src={documentDownloadImage}
                                      className="img-fluid"
                                      alt="..."
                                      style={{
                                        height: "30px",
                                        background: "inherit",
                                      }}
                                      onClick={() => downloadFile(row.id, data)}
                                    ></img>
                                  </div>
                                );
                              })
                            }
                            <td {...cell.getCellProps()}>
                              {makeLink && cell.column.id !== "downloadFile" ? (
                                <a
                                  className="case-link"
                                  onClick={() => {
                                    navigateToForm(row.id);
                                  }}
                                >
                                  {cell.render("Cell")}
                                </a>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          </>
                        );
                      })}
                    </tr>
                  );
                })
              : page.map((row, i) => {
                  //printConsole("Inside table component else row: ",row);
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={i}>
                      {showCheckBox !== undefined && showCheckBox === true && (
                        // <td>
                        //     <div class="form-check">
                        //         <input class="form-check-input" type="checkbox" onChange={((event)=>handleCheckBoxChange(event,row.id))} value="" id="caseCheckBox"
                        //         checked={row.original.isChecked !== undefined ? row.original.isChecked:false}/>
                        //     </div>
                        // </td>
                        <td>
                          {radioFlag !== undefined && radioFlag === true ? (
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                onChange={(event) =>
                                  handleRadioChange(event, row.id)
                                }
                                value=""
                                id="caseRadioDefault"
                                checked={
                                  row.original.isChecked !== undefined
                                    ? row.original.isChecked
                                    : false
                                }
                              ></input>
                            </div>
                          ) : (
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={(event) =>
                                  handleCheckBoxChange(event, row.id)
                                }
                                value=""
                                id="caseCheckBox"
                                checked={
                                  row.original.isChecked !== undefined
                                    ? row.original.isChecked
                                    : false
                                }
                              />
                            </div>
                          )}
                        </td>
                      )}
                      {row.cells.map((cell) => {
                        //printConsole("Inside table component else row id: ",row.id);
                        //printConsole("Inside table component else cells props: ",cell);
                        if (cell.column.id === "downloadFile") {
                          cell.column.Cell = (r) => {
                            //printConsole("Inside table component downloadFile row id: ",row.id);
                            return (
                              <div>
                                <img
                                  id="w9DocDownloadImage"
                                  src={documentDownloadImage}
                                  className="img-fluid"
                                  alt="..."
                                  style={{
                                    height: "30px",
                                    background: "inherit",
                                  }}
                                  onClick={() => downloadFile(row.id, data)}
                                ></img>
                              </div>
                            );
                          };
                        }
                        // return <td {...cell.getCellProps()}>{makeLink===true}?<a className="case-link" onClick={() => { navigateToForm(i) }}>{cell.render('Cell')}</a>
                        // :{cell.render('Cell')}</td>
                        return (
                          <td {...cell.getCellProps()}>
                            {makeLink && cell.column.id !== "downloadFile" ? (
                              <a
                                className="case-link"
                                onClick={() => {
                                  navigateToForm(row.id);
                                }}
                              >
                                {cell.render("Cell")}
                              </a>
                            ) : (
                              cell.render("Cell")
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </>
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <ul style={{ justifyContent: "center" }} className="pagination">
        <span
          style={{
            cursor: "pointer",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <li
            className="page-item"
            onClick={() => handlePageNavigation(0)}
            disabled={!canPreviousPage}
          >
            <p className="page-link">First</p>
          </li>
          <li
            className="page-item"
            onClick={() => {
              previousPage();
              dispatch({
                type: "UPDATE_PAGE_NUMBER",
                payload: { pageNumber: pageIndex },
              });
            }}
            disabled={!canPreviousPage}
          >
            <p className="page-link">{"<"}</p>
          </li>
          <li
            className="page-item"
            onClick={() => {
              nextPage();
              dispatch({
                type: "UPDATE_PAGE_NUMBER",
                payload: { pageNumber: pageIndex },
              });
            }}
            disabled={!canNextPage}
          >
            <p className="page-link">{">"}</p>
          </li>
          <li
            className="page-item"
            onClick={() => handlePageNavigation(pageCount - 1)}
            disabled={!canNextPage}
          >
            <p className="page-link">Last</p>
          </li>

          <li style={{ marginLeft: "1rem" }}>
            <p className="page-link">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </p>
          </li>
          <li style={{ marginLeft: "1rem" }}>
            <p className="page-link">
              <input
                className="form-control"
                type="number"
                value={pageIndex + 1}
                onChange={(e) => {
                  // const page = e.target.value ? Number(e.target.value) - 1 : 0
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                  // console.log(e.target)
                }}
                style={{ width: "120px", height: "24px" }}
              />
            </p>
          </li>
          <select
            className="form-control"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            style={{ width: "120px", height: "38px", marginLeft: "1rem" }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </span>
      </ul>
    </div>
  );
}

function TableComponent(prop) {
  const { printConsole } = useUpdateDecision();
  const makeLink = prop.makeLink === undefined ? false : prop.makeLink;
  const radioFlag = prop.radioFlag === undefined ? false : prop.radioFlag;
  //console.log("Nidhi prop: ", prop);
  const columnData = prop.columnName.split(",");
  const columns = [];
  //Added by Harshit wrt download button
  const isDownload = prop.isDownload === undefined ? false : prop.isDownload;
  const downloadHeaderName =
    prop.downloadHeaderName === undefined ? "Download" : downloadHeaderName;
  if (isDownload) {
    columnData.push(downloadHeaderName + "~downloadFile");
  }

  //Till Here

  /*if(prop.showCheckBox!==undefined && prop.showCheckBox === true){
        let json = {
            Header: "",
            accessor: "name",
            Cell: ({ cell }) => (
                //printConsole("Inside table component cell: ",cell.row.index);
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" onChange={(event)=>{event.preventDefault(); prop.handleCheckBoxChange(event,cell.row.index)}} value="" id="caseCheckBox"
                     />
                </div>
            )
        }
        columns.push(json);
    }*/
  columnData.forEach((elem) => {
    const col = elem.split("~");
    let colJson = {};
    colJson.Header = col[0];
    colJson.accessor = col[1];
    columns.push(colJson);
  });
  printConsole("Inside table component columns: ", columns);
  printConsole("Inside table component actual table data: ", prop.rowValues);
  let data = [];
  /*const rowData = prop.rowValues;
    rowData.forEach((el) => {
        let rowJson = {};
        columns.forEach(e => {
            const col = e.accessor;
            rowJson[col] = el[col];
        })
        data.push(rowJson);
    });*/

  data = prop.rowValues;
  //data=(prop.rowValue === undefined) ? [] : prop.rowValues;
  printConsole("Inside table component rows: ", data);
  // if (prop.length>0 && prop.rowValue === undefined)
  // {
  //     alert("No records found for this Search.");
  // }

  /*const columns = React.useMemo(
        () => [

            {
                Header: 'First Name',
                accessor: 'firstName',
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
            },
            {
                Header: 'Age',
                accessor: 'age',
            },
            {
                Header: 'Visits',
                accessor: 'visits',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
            {
                Header: 'Profile Progress',
                accessor: 'progress',
            },
        ],
        []
    )*/

  /*const data = [
        {
            "firstName": "committee-c15dw",
            "lastName": "editor-ktsjo",
            "age": 3,
            "visits": 46,
            "progress": 75,
            "status": "relationship"
        },
        {
            "firstName": "midnight-wad0y",
            "lastName": "data-7h4xf",
            "age": 1,
            "visits": 56,
            "progress": 15,
            "status": "complicated"
        },
        {
            "firstName": "tree-sbdb0",
            "lastName": "friendship-w8535",
            "age": 1,
            "visits": 45,
            "progress": 66,
            "status": "single"
        },
        {
            "firstName": "chin-borr8",
            "lastName": "shirt-zox8m",
            "age": 0,
            "visits": 25,
            "progress": 67,
            "status": "complicated"
        },
        {
            "firstName": "party-c15dw",
            "lastName": "journey-ktsjo",
            "age": 7,
            "visits": 96,
            "progress": 25,
            "status": "relationship"
        },
        {
            "firstName": "dayacre-wad0y",
            "lastName": "dummy-7h4xf",
            "age": 13,
            "visits": 67,
            "progress": 15,
            "status": "complicated"
        },
        {
            "firstName": "plant-sbdb0",
            "lastName": "ship-w8535",
            "age": 11,
            "visits": 45,
            "progress": 66,
            "status": "single"
        },
        {
            "firstName": "shin-borr8",
            "lastName": "pant-zox8m",
            "age": 4,
            "visits": 25,
            "progress": 67,
            "status": "complicated"
        },
        {
            "firstName": "women-83ef0",
            "lastName": "chalk-e8xbk",
            "age": 9,
            "visits": 28,
            "progress": 23,
            "status": "relationship"
        },
        {
            "firstName": "women-83ef0",
            "lastName": "chalk-e8xbk",
            "age": 9,
            "visits": 28,
            "progress": 23,
            "status": "relationship"
        },
        {
            "firstName": "women-83ef0",
            "lastName": "chalk-e8xbk",
            "age": 9,
            "visits": 28,
            "progress": 23,
            "status": "relationship"
        },
        {
            "firstName": "women-83ef0",
            "lastName": "chalk-e8xbk",
            "age": 9,
            "visits": 28,
            "progress": 23,
            "status": "relationship"
        }
    ]*/
  // console.log(JSON.stringify(data));
  return (
    <Table
      columns={columns}
      data={data !== undefined ? data : []}
      showCheckBox={prop.showCheckBox !== undefined ? prop.showCheckBox : false}
      handleCheckBoxChange={
        prop.handleCheckBoxChange !== undefined ? prop.handleCheckBoxChange : {}
      }
      handleRadioChange={
        prop.handleRadioChange !== undefined ? prop.handleRadioChange : {}
      }
      radioFlag={radioFlag}
      makeLink={makeLink}
      navigateToForm={
        prop.navigateToForm !== undefined ? prop.navigateToForm : {}
      }
      downloadFile={prop.downloadFile !== undefined ? prop.downloadFile : {}}
      isNavigated={prop?.isNavigated}
      fromComponent={prop.fromComponent}
    />
  );
}

export default TableComponent;
