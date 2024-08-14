import React from "react";
import Multiselect from "multiselect-react-dropdown";

export default function TableRows({
  rowsData,
  deleteTableRows,
  handleChange,
  specialityArray,
}) {
  return rowsData.map((data, index) => {
    const { fullName, emailAddress, salary, specialityDefault } = data;
    return (
      <tr key={index}>
        <td>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteTableRows(index)}
          >
            x
          </button>
        </td>
        <td>
          <input
            type="text"
            value={fullName}
            onChange={(evnt) => handleChange(index, evnt)}
            name="fullName"
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={emailAddress}
            onChange={(evnt) => handleChange(index, evnt)}
            name="emailAddress"
            className="form-control"
          />{" "}
        </td>
        <td>
          <input
            type="text"
            value={salary}
            onChange={(evnt) => handleChange(index, evnt)}
            name="salary"
            className="form-control"
          />{" "}
        </td>
        <td>
          <Multiselect
            isObject={false}
            onKeyPressFn={function noRefCheck() {}}
            onRemove={function noRefCheck() {}}
            onSearch={function noRefCheck() {}}
            onSelect={function noRefCheck() {}}
            options={specialityArray}
            id="specialityDropdown"
            showArrow={true}
            singleSelect={true}
            selectedValues={specialityDefault}
            name="speciality"
          />
        </td>
      </tr>
    );
  });
}
