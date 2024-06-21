import React from "react";

export default function FilterComponent ({ filterText, onFilter, onClear }){
    return (
                <>
                    <div className="row">
                      <div className="col-8 pe-0">
                        <input
                          type="text"
                          placeholder="Filter table data..."
                          value={filterText}
                          onChange={onFilter}
                          className="form-control"
                        />
                      </div>
                      &nbsp;&nbsp;
                      <div className="col-2 ps-0">
                        <button className="btn btn-primary"  onClick={onClear}>clear</button>
                      </div>
                    </div>
                </>
    );
}
