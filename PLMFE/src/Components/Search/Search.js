import React, { useRef } from "react";
import "./Search.css";

export default function Search({ columnNames, onSearch, onClear }) {
  const searchtext = useRef();
  const selectedColumn = useRef();

  const searchHandler = () => {
    onSearch(selectedColumn.current.value, searchtext.current.value);
  };

  const clearHandler = () => {
    onClear();
  };

  return (
    <div className="input-group mb-3 search-container">
      <select className="form-select" ref={selectedColumn}>
        {columnNames.map((columnName) => {
          return (
            <option key={columnName.name} value={columnName.name}>
              {columnName.displayName}
            </option>
          );
        })}
        {/* <option value="all">All</option> */}
      </select>
      <input
        type="text"
        className="form-control"
        ref={searchtext}
        placeholder="Search..."
        size={200}
      />
      <button className="btn search-button" onClick={searchHandler}>
        <i className="fa fa-search"></i>
      </button>

      <button className="btn btn-primary ms-2" onClick={clearHandler}>
        Clear
      </button>
    </div>
  );
}
