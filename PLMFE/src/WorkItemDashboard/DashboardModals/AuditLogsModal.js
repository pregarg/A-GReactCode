
import { Button, Modal } from "react-bootstrap";
import useGetDBTables from "../../Components/CustomHooks/useGetDBTables";
import { useEffect, useState } from "react";

export default function AuditLogsModal(props) {
  const [htmlContent, setHtmlContent] = useState("");
 const { convertToCase } = useGetDBTables();
  // Constants for better maintainability
  const OPERATION_COLORS = {
    "Data Modified": "purple",
    "Data Deleted": "red",
    "Data Inserted": "green",
    default: "black",
  };

  const EXCLUDED_KEYS = ["caseNumber", "CaseHeader", "ANG_Case_Header","case_aging"];

  // Helper function to toggle modal visibility
  const handleModalShowHide = (isVisible) => {
    props.setModalShow({ ...props.modalShow, AuditLogsModal: isVisible });
  };

  // Get color for operation type
  const getOperationColor = (operation) => OPERATION_COLORS[operation] || OPERATION_COLORS.default;

  // Recursively parse objects into styled HTML content
  const objectToHTML = (obj) => {
    let html = "";

    const parseObject = (key, value) => {
      if (EXCLUDED_KEYS.includes(key) || key === "case_aging") return;
      if (EXCLUDED_KEYS.includes(key)) return; // Skip excluded keys
      if (key === "userName" && value === "abshek123"|| key === "caseNumber"|| key==="Case Aging") {
        return; // Skip this specific username
      }
    
      const formattedKey = key.replace(/^ANG_/, "").replace(/_/g, " ");

      if (typeof value === "object" && !Array.isArray(value)) {
        html += `<h4 style='color: blue; font-size: 16px; font-weight: bold;'>${formattedKey}:</h4>`;
        Object.entries(value).forEach(([innerKey, innerValue]) => parseObject(innerKey, innerValue));
      } else if (Array.isArray(value)) {
        html += generateTable(formattedKey, value);
      } else {
        if (key === "operation") {
          const displayValue =
            value === "U"
              ? "Data Modified"
              : value === "I"
              ? "Data Inserted"
              : value === "D"
              ? "Data Deleted"
              : value;
          const color = getOperationColor(displayValue);
          html += `<p style='color: ${color};'><strong>${formattedKey}:</strong> ${displayValue}</p>`;
        } else {
          html += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
        }
      }
    };

    Object.entries(obj).forEach(([key, value]) => parseObject(key, value));
    return html;
  };

  // Generate table for array values
  const generateTable = (title, data) => {
    let tableHTML = `<h4 style='color: blue; font-size: 16px; font-weight: bold;'>${title}:</h4>`;
    tableHTML += `
      <div style='overflow-x: auto; max-width: 100%; border: 1px solid #ddd; border-radius: 5px;'>
        <table class='table table-bordered' style='width: 100%; table-layout: auto; text-align: left;'>
          <thead>
            <tr>
              <th>#</th> <!-- Row Number Column -->
              <th>Operation</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>`;
  
    // Loop through data array
    data.forEach((item, index) => {
      // Determine the operation(s) and split them into individual operations if needed
      const operations = Array.isArray(item.operation) ? item.operation : [item.operation];
  
      // Render a row for each operation
      operations.forEach((op, opIndex) => {
        const operation =
        
          op === "U"
            ? "Data Modified"
            : op === "I"
            ? "Data Inserted"
            : op === "D"
            ? "Data Deleted"
            :item.operation || props.auditLogs[props.clickedIndex].stageName?.toLowerCase() === 'start'? "Data Inserted" : "Data Modified";
  
        const color = getOperationColor(operation);
  
        if (operation === "Data Deleted") {
          // Render the deleted row's data, ignoring empty fields
          const deletedDetails = Object.keys(item)
            .filter((key) => key !== "operation" && item[key]) // Exclude "operation" and empty values
            .map((key) => `<strong>${key.replace(/_/g, " ")}:</strong> ${item[key]}`)
            .join("<br>");
            
          tableHTML += `
            <tr>
              <td style='text-align: center;'>${index + 1}${opIndex > 0 ? `.${opIndex}` : ""}</td>
              <td style='color: ${color}; font-weight: bold; text-align: center;'>${operation}</td>
              <td style='color: red; text-align: left;'>${deletedDetails}</td>
            </tr>`;
        }
        
        else {
          // Default rendering for other operations
          tableHTML += `<tr><td style='text-align: center;'>${index + 1}${opIndex > 0 ? `.${opIndex}` : ""}</td>`;
          tableHTML += `<td style='color: ${color}; font-weight: bold; text-align: center;'>${operation}</td>`;
          const details = Object.keys(item)
            .filter((key) => key !== "operation")
            .map((key) => `<strong>${key.replace(/_/g, " ")}:</strong> ${item[key]}`)
            .join("<br>");
          tableHTML += `<td>${details}</td>`;
          tableHTML += `</tr>`;
        }
      });
    });
  
    tableHTML += `</tbody></table></div>`;
    return tableHTML;
  };
  
  
  // Clean up payload data to exclude unwanted keys and empty values
  // const cleanUpPayload = (obj) => {
  //   if (!obj || typeof obj !== "object") return;
  
  //   Object.keys(obj).forEach((key) => {
  //     // Remove "case_aging" explicitly and any other excluded keys
  //     if (EXCLUDED_KEYS.includes(key) || key === "caseNumber" || key === "rowNumber" || key === "case_aging") {
  //       delete obj[key]; // Remove the unwanted key
  //     } else if (Array.isArray(obj[key])) {
  //       // If the value is an array, iterate through its items
  //       obj[key] = obj[key].filter((item) => {
  //         if (typeof item === "object") {
  //           // Remove unwanted keys from objects in the array
  //           EXCLUDED_KEYS.forEach((excludedKey) => delete item[excludedKey]);
  //           delete item.caseNumber;
  //           delete item.rowNumber;
  //           delete item.case_aging; // Explicitly remove "case_aging" from array items
  //         }
  //         return Object.keys(item).length > 0; // Keep items with non-empty properties
  //       });
  //       if (obj[key].length === 0) delete obj[key]; // Remove the array if it's empty
  //     } else if (typeof obj[key] === "object") {
  //       // If the value is a nested object, clean it recursively
  //       cleanUpPayload(obj[key]);
  //       if (Object.keys(obj[key]).length === 0) delete obj[key]; // Remove the object if it's empty
  //     }
  //   });
  // };
  
  const cleanUpPayload = (obj) => {
    if (!obj || typeof obj !== "object") return;

    Object.keys(obj).forEach((key) => {
        // Remove "case_aging", "maincase", and any other excluded keys
        if (
            EXCLUDED_KEYS.includes(key) ||
            key.toLowerCase() === "maincase" ||
            key === "caseNumber" ||
            key === "rowNumber" ||
            key === "case_aging" ||
            key === "MainCaseTable" // Explicitly remove MainCaseTable
        ) {
            delete obj[key]; // Remove the unwanted key
        } else if (Array.isArray(obj[key])) {
            // If the value is an array, iterate through its items
            obj[key] = obj[key].filter((item) => {
                if (typeof item === "object") {
                    // Remove unwanted keys and 'MainCaseTable' data from objects in the array
                    EXCLUDED_KEYS.forEach((excludedKey) => delete item[excludedKey]);
                    if (item.MainCaseTable) delete item.MainCaseTable; // Remove MainCaseTable
                    delete item.caseNumber;
                    delete item.rowNumber;
                    delete item.case_aging; // Explicitly remove "case_aging" from array items
                }
                return Object.keys(item).length > 0; // Keep items with non-empty properties
            });
            if (obj[key].length === 0) delete obj[key]; // Remove the array if it's empty
        } else if (typeof obj[key] === "object") {
            // If the value is a nested object, clean it recursively
            if (key === "MainCaseTable") {
                delete obj[key]; // Remove MainCaseTable if found as a nested object
            } else {
                cleanUpPayload(obj[key]);
                if (Object.keys(obj[key]).length === 0) delete obj[key]; // Remove the object if it's empty
            }
        }
    });
};

  

  // Prepare content on payload data change
  useEffect(() => {
    if (props.payloadData) {
      cleanUpPayload(props.payloadData);
     
          if (props.payloadData.ANG_Case_Timelines) {
            // Remove Compliance_Time_Left_to_Finish and Case Aging keys
            delete props.payloadData.ANG_Case_Timelines.Compliance_Time_Left_to_Finish;
            delete props.payloadData.ANG_Case_Timelines.case_aging;

            // Remove ANG_Case_Timelines if it contains only the operation key or becomes empty
            if (
              Object.keys(props.payloadData.ANG_Case_Timelines).length === 1 &&
              props.payloadData.ANG_Case_Timelines.operation
            ) {
              delete props.payloadData.ANG_Case_Timelines; // Remove if only operation exists
            } else if (Object.keys(props.payloadData.ANG_Case_Timelines).length === 0) {
              delete props.payloadData.ANG_Case_Timelines; // Remove if completely empty
            }
          }
    
          console.log("Cleaned Payload Data: ", props.payloadData);
          setHtmlContent(objectToHTML(props.payloadData));
        }
      }, [props]);


    

  // Render modal content
  return (
    <Modal
      show={props.modalShow.AuditLogsModal}
      onHide={() => handleModalShowHide(false)}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-dialog"
      size="xl"
      aria-labelledby="audit-logs-modal"
      centered
    >
      <Modal.Header>
        <Modal.Title>Audit Logs Details</Modal.Title>
        <Button
          className="btn btn-outline-primary btnStyle"
          onClick={() => handleModalShowHide(false)}
        >
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Modal.Body>
    </Modal>
  );
}
