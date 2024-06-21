import { useAxios } from "../../../../api/axios.hook";
import DeleteModal from "./DeleteModal";
import React, { useEffect, useState } from "react";

export default function TableSection() {
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [tableData, setTableData] = useState([]);
  const { customAxios: axios } = useAxios();
  const cancelDeleteHandler = () => {
    setDeleteModal({ show: false, id: null });
  };

  const confirmDeleteHandler = (id) => {
    setDeleteModal({ show: true, id: id });
  };

  const deleteTableDataHandler = (id) => {
    const table = {
      ddlType: "DROP",
      tableName: id,
    };
    axios
      .post("/table/ddl", table)
      .then((res) => {
        console.log("api response: ", res.status);
        if (res.status === 200) {
          console.log("succ");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getAllTables = () => {
    console.log("get all tables");
    axios.get("/table/list").then((res) => {
      console.log("list: ", res.data);
      if (res.status === 200) {
        setTableData(res.data);
      }
    });
  };
  useEffect(() => {
    getAllTables();
  }, []);

  const getTables = () => {
    return tableData.map((table, index) => {
      return (
        <tr key={index}>
          <td>
            <button
              className="deleteBtn"
              style={{ float: "left" }}
              onClick={() => {
                confirmDeleteHandler(table);
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
          <td>{table}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="mt-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Table Name</th>
            </tr>
          </thead>
          <tbody>{getTables()}</tbody>
        </table>
      </div>
      <DeleteModal
        deleteModal={deleteModal}
        Content={"Do you want to delete this table?"}
        onDelete={deleteTableDataHandler}
        onCancel={cancelDeleteHandler}
      />
    </>
  );
}
