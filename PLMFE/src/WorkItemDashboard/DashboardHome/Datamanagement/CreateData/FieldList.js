import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";

export default function FieldListSection({
  tableFields,
  deleteFieldFromList,
  addField,
  editField,
}) {
  const [tableRows, setTableRows] = useState();

  useEffect(() => {
    setTableRows(tableFields);
  }, [tableFields]);

  const columns = [
    {
      name: (
        <button className="btn btn-primary" onClick={addField}>
          Add Field
        </button>
      ),
      cell: (row, i) => {
        return (
          <div>
            <button
              className="editBtn me-1"
              onClick={() => {
                editField(i);
              }}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="deleteBtn"
              onClick={() => {
                deleteField(i);
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        );
      },
    },
    {
      name: "Field Name",
      selector: (row) => row.fieldName,
    },
    {
      name: "Type",
      selector: (row) => row.fieldType,
    },
    {
      name: "Precision",
      selector: (row) => row.precision,
    },
    {
      name: "Size",
      selector: (row) => row.size,
    },
    {
      name: "Null",
      selector: (row) => (row.isNull ? "Yes" : "No"),
    },
    {
      name: "Primary",
      selector: (row) => (row.isPrimary ? "Yes" : "No"),
    },
  ];

  const deleteField = (i) => {
    deleteFieldFromList(i);
  };

  return (
    <DataTable
      columns={columns}
      data={tableRows}
      customStyles={{ minHeight: "300px" }}
      persistTableHead="true"
    />
  );
}
