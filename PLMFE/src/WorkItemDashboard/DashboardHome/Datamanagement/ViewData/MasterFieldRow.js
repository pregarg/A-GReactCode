import * as React from "react";
import { Button, TableCell, TableRow } from "@mui/material";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export default function MasterFieldRow({
  row,
  index,
  ATTRIBUTE_LIST_HEADER,
  deleteField,
  editField,
}) {
  return (
    <React.Fragment>
      <TableRow
        key={row?.name}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        {" "}
        {ATTRIBUTE_LIST_HEADER.map((item) => {
          if (item === "Actions") {
            return (
              <TableCell scope="row" align="left">
                <AiFillDelete
                  fontSize="16px"
                  color="#990f02"
                  cursor="pointer"
                  onClick={() => {
                    deleteField(index);
                  }}
                />
                <AiFillEdit
                  fontSize="18px"
                  color="black"
                  cursor="pointer"
                  onClick={() => {
                    editField(index);
                  }}
                />{" "}
              </TableCell>
            );
          }
          if (item === "Field Name") {
            return (
              <TableCell align="left">
                {row?.fieldName ? row?.fieldName : "_"}
              </TableCell>
            );
          }
          if (item === "Type") {
            return (
              <TableCell align="left">
                {row.fieldType ? row?.fieldType?.toUpperCase() : "_"}
              </TableCell>
            );
          }
          if (item === "Size") {
            return (
              <TableCell align="left">{row.size ? row?.size : "_"}</TableCell>
            );
          }
          if (item === "Primary") {
            return (
              <TableCell align="left">{row.isPrimary ? "YES" : "NO"}</TableCell>
            );
          }
          if (item === "Null") {
            return (
              <TableCell align="left">{row.isNull ? "YES" : "NO"}</TableCell>
            );
          }
        })}
      </TableRow>
    </React.Fragment>
  );
}
