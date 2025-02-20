import React, { useEffect, useRef, useState } from "react";
import documentDownloadImage from "../../Images/DocumentDownloadImage.png";
import documentUploadImage from "../../Images/DocumentUploadImage.png";
import Select, { StylesConfig } from "react-select";
import { useSelector } from "react-redux";
import FileUpload from "../../WorkItemDashboard/DashboardFileUpload/FileUpload";
import useUpdateDecision from "../CustomHooks/useUpdateDecision";
import useSwalWrapper from "../../Components/SweetAlearts/hooks";
import { useAxios } from "../../api/axios.hook";
import DocumentViewer from "../../Components/CommonComponents/DocumentViewer";

export default function DocumentSection(prop) {
console.log("document prop", prop)

  const docClickedIndex = useRef();

  const selectRef = useRef(null);
  const Swal = useSwalWrapper();
  const { fileUpDownAxios } = useAxios();
  const { printConsole, getRowNumberForGrid } = useUpdateDecision();

  const [docViewDialog, setDocViewDialog] = useState({
    open: false,
    url: "",
    fileName: "",
    fileType: "",
  });

  let restrictedFileTypes = ["xls", "eps", "sql", "xlsx", "docx"];

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 1000, // Set your desired z-index value here
    }),
    control: (provided) => ({
      ...provided,
      zIndex: 1000, // Set z-index for the control if needed
    }),
  };
  const masterAngDocumentSelector = useSelector(
    (state) => state?.masterAngDocument,
  );
  const masterPDDocumentSelector = useSelector(
    (state) => state?.masterPDDocument,
  );
  console.log("Document Masters Selector: APPEALS", masterAngDocumentSelector);
  console.log("Document Masters Selector:", masterPDDocumentSelector);

  const [modalShow, setModalShow] = useState(false);

  const [fileState, setFileState] = useState([]);

  const [documentNameValues, setDocumentNameValues] = useState([]);
  const [documentData, setDocumentData] = useState([]);

  
  useEffect(() => {
    const stageName = prop.stageName || prop.stageName.trim();
    
    let documentOptions = [];
    
    if (prop.displayName === "Appeals" && masterAngDocumentSelector) {
      
      documentOptions = masterAngDocumentSelector.length === 0 ? [] : masterAngDocumentSelector[0];
      console.log("Document Section Appeals documentOptions: ", documentOptions);
    } else if (prop.displayName === "Provider Disputes" && masterPDDocumentSelector) {
      documentOptions = masterPDDocumentSelector.length === 0 ? [] : masterPDDocumentSelector[0];
      console.log("Document Section documentOptions: ", documentOptions);
    }
    if (documentOptions.length > 0) {
      documentOptions = documentOptions.filter(
        (elem) =>
          elem.WORKSTEP_NAME.toLowerCase() === stageName.toLowerCase()
      );
  
      console.log("Document Section documentOptions after filter: ", documentOptions);
  
      let newDocumentValues = [];
      documentOptions.forEach((element) => {
        let sJson = {
          label: element.DOCUMENT_NAME,
          value: element.DOCUMENT_NAME,
        };
        newDocumentValues.push(sJson);
      });
  
      setDocumentNameValues(newDocumentValues);
    }
  }, [prop,masterAngDocumentSelector, masterPDDocumentSelector]);
  
  const handleGridSelectChange = (index, selectedValue, documentName) => {
    let rowsInput = "";
    const { name } = documentName;
    rowsInput = [...documentData];
    rowsInput[index][name] = {
      label: selectedValue.value,
      value: selectedValue.value,
    };
    setDocumentData(rowsInput);

    console.log("documentData handleGridSelectChange1111", documentData);
  };

  const uploadFile = (paramData, index) => {
    printConsole("Inside uploadFile index: ", index);
    printConsole("File Upload State: ", paramData);
    printConsole("File State: ", fileState);
    let fileJson = {};
    let selectedFile = null;
    fileState.forEach((el) => {
      if (el.fileIndex === index) {
        selectedFile = el.selectedFile;
      }
    });
    printConsole("Selected file on index: ", selectedFile);
    if (selectedFile !== null) {
      fileJson.fileData = selectedFile;
      fileJson.documentType = paramData[index].documentType.value;
      fileJson.docStatus = "Uploaded";
      fileJson.documentName = selectedFile.name;
      prop.fileDataRef[index] !== undefined
        ? (prop.fileDataRef[index] = fileJson)
        : prop.fileDataRef.push(fileJson);
      modifyDocumentValues(fileJson.documentType, "remove");
      let docJson = documentData[index];
      docJson.docStatus = "Uploaded";
      docJson.documentName = selectedFile.name;
      documentData[index] = docJson;
      setDocumentData(documentData);
      console.log("fileDataRef Updated: ", prop.fileDataRef);
      handleModalShowHide(index, false);
    } else {
      alert("Please first select document to upload.");
    }

    
  };

  const checkIfDocNameExists = (docName) => {
    let retFlag = false;
    if (documentNameValues.length > 0) {
      documentNameValues.forEach((el) => {
        if (el.value === docName) {
          retFlag = true;
          return;
        }
      });
      return retFlag;
    } else {
      return false;
    }
  };

  const modifyDocumentValues = (docValue, operValue) => {
    console.log("Inside modifyDocumentValues operValue: ", operValue, docValue);
    if (docValue !== "" && docValue !== "Other Documents") {
      let newDocValue = [];
      if (operValue === "add") {
        if (!checkIfDocNameExists(docValue)) {
          newDocValue = [...documentNameValues];
          const newJson = {};
          newJson.label = docValue;
          newJson.value = docValue;
          newDocValue.push(newJson);
          setDocumentNameValues(newDocValue);
        }
      }

      if (operValue === "remove") {
        newDocValue = documentNameValues.filter(
          (elem) => elem.value !== docValue,
        );
        setDocumentNameValues(newDocValue);
      }
    }
  };
  const handleModalShowHide = (index, flagValue, requestedFrom) => {
    console.log("Index Value= ", index);
    if (requestedFrom === "Close") {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }
    let documentName =
      documentData[index]["documentType"] === undefined
        ? ""
        : documentData[index]["documentType"].value;

    console.log(
      "Inside Document Section handleModalShowHide documentName: ",
      documentName,
    );
    console.log(
      "Inside Document Section handleModalShowHide documentName is Focused: ",
      selectRef.current,
    );
    if (documentName === "") {
      alert("Please select Document Name first");
      selectRef.current.focus();
    } else {
      docClickedIndex.current = index;
      console.log("docClickedIndex.current: ", docClickedIndex.current);
      setModalShow(flagValue);
    }
  };



  const handleFileUpload = (evnt, index) => {
    console.log("abc")
    if (evnt.target.files[0] === undefined) {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }

    if (evnt.target.files[0] !== undefined) {
      if (
        documentData[index].documentType === "Draft Contract" ||
        documentData[index].documentType === "Final Contract"
      ) {
        const fileExt = evnt.target.files[0].name.split(".").pop();
        console.log("fileExt--->", fileExt)
        if (fileExt !== "docx" && fileExt !== "doc") {
          alert("Only docx or doc file type supported.");
          evnt.target.value = null;
          return;
        }
      }

      const file = evnt.target.files[0];
      console.log("abc--->",file)
      const objectUrl = URL.createObjectURL(file);
      console.log("object url--->", objectUrl);
      setFileState([...fileState, { selectedFile: file, fileIndex: index }]);

      const newDocumentData = [...documentData];
      newDocumentData[index] = {
        ...newDocumentData[index],
        fileUrl: objectUrl,
        documentName: file.name,
      };
      setDocumentData(newDocumentData);
    }
  };

  const addTableRows = () => {
    const rowsInput = {};
    // rowsInput.rowNumber = documentData.length + 1;
    rowsInput.rowNumber = getRowNumberForGrid(documentData);
    rowsInput.docStatus = "Pending";
    setDocumentData([...documentData, rowsInput]);
    console.log("Last added row: ", documentData[documentData.length - 1]);
  };

  const deleteTableRows = (index) => {
    setFileState([]);
    const tempRows = [...documentData];
    console.log("Inside delete table rows: ", tempRows[index]["documentType"]);
    const documentName =
      tempRows[index]["documentType"] !== undefined
        ? tempRows[index]["documentType"].value
        : "";
    modifyDocumentValues(documentName, "add");
    tempRows.splice(index, 1);
    prop.fileDataRef.splice(index, 1);
    setDocumentData(tempRows);
  };

  
  const handleSelectItemPos = () => {
    let ItemPosition = document.getElementById("documentType")?.offsetTop;
    if (ItemPosition > 2200 && documentNameValues.length > 1) {
      return true;
    } else return false;
  };
  const documentsData = () => {
    console.log("documentData: ", documentData);

    if (documentData.length > 0) {
      return documentData.map((data, index) => (
        <tr key={index}>
          <td>
            {data.sno == undefined ? (
              <button
                className="deleteBtn"
                style={{ textAlign: "center" }}
                onClick={() => {
                  deleteTableRows(index);
                }}
              >
                <i className="fa fa-trash"></i>
              </button>
            ) : (
              index + 1
            )}
          </td>
          <td className="tableData">
            {data.docStatus !== "Uploaded" ? (
              <Select
                value={data.documentType}
                styles={customStyles}
                ref={selectRef}
                menuPlacement={handleSelectItemPos() ? "top" : "auto"}
                options={documentNameValues}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(index, selectValue, event)
                }
                name="documentType"
                id="documentType"
              />
            ) : (
              data.documentType.value
            )}
          </td>
          <td>{data.documentName}</td>
          <td>
            <img
              id="w9DocUploadImage"
              src={documentUploadImage}
              className="img-fluid"
              alt="..."
              style={{ height: "30px", background: "inherit" }}
              onClick={() => handleModalShowHide(index, true)}
            ></img>
          </td>
          <td>{data.docStatus}</td>
          <td>
            {data.fileUrl && (
              <i
                className="fa fa-eye"
                style={{
                  height: "30px",
                  background: "inherit",
                  fontSize: "20px",
                  alignContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setDocViewDialog({
                    open: true,
                    url: data.fileUrl,
                    fileName: data.documentName,
                    fileType: data.documentName.split(".").pop(),
                  });
                }}
              >
                
              </i>
            )}
          </td>
        </tr>
      ));
    }
  };

  return (
    <>
      <div className="DocumentSection">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingDocuments">
            <button
              className="accordion-button accordionButtonStyle"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseDocuments"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseDocument"
            >
              Documents
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseDocuments"
            className="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingDocuments"
          >
            <div className="accordion-body">
              <table
                className="table table-bordered tableLayout"
                style={{ textAlign: "center" }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "6%" }}>
                      <button
                        className="addBtn"
                        onClick={() => {
                          addTableRows();
                        }}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </th>

                    <th style={{ width: "20%" }} scope="col">
                      Document Name
                    </th>
                    <th scope="col">Uploaded FileName</th>
                    <th style={{ width: "10%" }} scope="col">
                      Upload
                    </th>
                    <th style={{ width: "20%" }} scope="col">
                      Status
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>{documentsData()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <FileUpload
          modalShow={modalShow}
          handleModalShowHide={handleModalShowHide}
          handleFileUpload={handleFileUpload}
          uploadFile={uploadFile}
          currIndex={docClickedIndex.current}
          documentData={documentData}
        />

        {docViewDialog.open && (
          <DocumentViewer
            open={docViewDialog}
            close={() =>
              setDocViewDialog({ ...docViewDialog, open: false, url: "" })
            }
            dialogViewData={docViewDialog}
          />
        )}
      </div>
    </>
  );
}
