import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import documentDownloadImage from "../../../Images/DocumentDownloadImage.png";
import documentUploadImage from "../../../Images/DocumentUploadImage.png";
import FileUpload from "../../DashboardFileUpload/FileUpload";
import { useSelector } from "react-redux";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables";
import useUpdateDecision from "../../../Components/CustomHooks/useUpdateDecision";
import useCallApi from "../../../Components/CustomHooks/useCallApi";
import DocumentVersion from "../../DocumentVersion";
import viewDocumentImage from "../../../Images/viewDataLogo.png";
import DocumentViewer from "../../../Components/CommonComponents/DocumentViewer";
import useSwalWrapper from "../../../Components/SweetAlearts/hooks";

export default function DocumentTab(props) {
  const { printConsole, disableAllElements } = useUpdateDecision();
  const [documentData, setDocumentData] = useState([]);
  const [caseDocuments, setCaseDocuments] = useState([]);
  const [versionDocuments, setVersionDocuments] = useState([]);
  const selectRef = useRef(null);
  const [documentNameValues, setDocumentNameValues] = useState({});
  const docClickedIndex = useRef({});
  const [modalShow, setModalShow] = useState({
    FileUpload: false,
    Version: false,
  });
  const [fileState, setFileState] = useState([]);
  const mastersSelector = useSelector((masters) => masters);
  const { customAxios, fileUpDownAxios } = useAxios();
  const { getTableDetails, convertToDateObj } = useGetDBTables();
  const userName = useSelector((state) => state.auth.userName);
  let documentNames = [];
  const [docViewDialog, setDocViewDialog] = useState({
    open: false,
    url: "",
    fileName: "",
    fileType: "",
  });
  const Swal = useSwalWrapper();

  const { downloadFile } = useCallApi();

  const addTableRows = () => {
    documentData.forEach((el) => {
      if (el.documentType !== "Other Documents") {
        modifyDocumentValues(el.documentType, "remove");
      }
    });
    const rowsInput = {};
    rowsInput.rowNumber = documentData.length + 1;
    rowsInput.caseNumber = 0;
    setDocumentData([...documentData, rowsInput]);
  };

  const statusInfo = [
    { label: "Pending", value: "Pending" },
    { label: "Uploaded", value: "Uploaded" },
  ];

  const deleteTableRows = (index, documentType) => {
    const tempRows1 = [...documentData];
    const tempRows = convertArrayToOuterArray(documentData);
    const ind = tempRows[index].rowNumber - 1;
    if (documentType !== undefined && documentType !== null) {
      modifyDocumentValues(documentType, "add");
    }

    tempRows1.splice(ind, 1);
    setDocumentData(tempRows1);
  };

  const handleGridSelectChange = (
    index,
    selectedValue,
    documentName,
    rowsInput
  ) => {
    modifyDocumentValues(selectedValue.value, "remove");
    const { name } = documentName;
    rowsInput[index][name] = selectedValue.value;

    setDocumentData(rowsInput);
  };

  const modifyDocumentValues = (docValue, operValue) => {
    if (
      docValue !== "" &&
      docValue !== "Other Documents" &&
      docValue !== undefined
    ) {
      let newDocValue = [];
      if (operValue === "add") {
        console.log(
          "Inside modifyDocumentValues is docName exists: ",
          checkIfDocNameExists(docValue)
        );
        newDocValue = [...documentNameValues];
        const newJson = {};
        newJson.label = docValue;
        newJson.value = docValue;

        newDocValue.push(newJson);
        setDocumentNameValues(newDocValue);
        //}
      }

      if (operValue === "remove") {
        newDocValue = documentNameValues.filter(
          (elem) => elem.value !== docValue
        );
        setDocumentNameValues(newDocValue);
      }
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

  useEffect(() => {
    disableAllElements(props, "PDM");
    let documentJson = {};
    if (mastersSelector.hasOwnProperty("masterDocumentName")) {
      documentJson.documentNameOptions =
        mastersSelector["masterDocumentName"].length === 0
          ? []
          : mastersSelector["masterDocumentName"][0];

      documentJson["documentNameOptions"]
        .filter((data) => data.FlowId == 2)
        .map((val) =>
          documentNames.push({ value: val.DocumentName, label: val.DocumentName })
        );

      //Here we are setting state documentNameValues
      setTimeout(() => {
        setDocumentNameValues(documentNames);
      }, 1000);
    }

    docFunction();
  }, []);

  const uploadFile = (paramData, index) => {
    paramData = convertArrayToOuterArray(paramData);
    let selectedFile = null;
    fileState.forEach((el) => {
      if (el.fileIndex === index) {
        selectedFile = el.selectedFile;
      }
    });
    if (selectedFile !== null) {
      const fileData = new FormData();
      const documentType = paramData[index].documentType;
      let caseId = 0;
      fileData.append("file", selectedFile);

      fileData.append("caseNumber", caseId);

      fileData.append("docType", documentType);
      fileData.append("source", "Manual");
      fileData.append("contractId", props.contractId);
      fileData.append("providerId", props.providerId);
      fileUpDownAxios.post("/uploadFile", fileData).then((res) => {
        if (res.data.fileName !== "Failed") {
          alert("Document Uploaded Successfully");
          docFunction();
          setFileState([]);
          handleModalShowHide(index, false);
          deleteTableRows(index, documentType);
        }
        if (res.data.fileName === "Failed") {
          alert("Error in uploading file");
        }
      });
    } else {
      alert("Please first select document to upload.");
    }
  };

  let restrictedFileTypes = ["xls", "eps", "sql", "xlsx", "docx"];
  const downloadedfileBlob = (index, documentData) => {
    const { caseNumber, documentType, documentName, docUploadPath } =
      documentData[index] || {};
    if (!caseNumber && !documentType && !documentName) {
      Swal.fire({
        icon: "error",
        title: "Please Upload The File First",
      });
      return;
    }
    const caseId = Number(caseNumber) ?? 0;
    const fileData = new FormData();
    if (docUploadPath !== undefined) {
      fileData.append("downloadFilePath", docUploadPath);
    }
    fileData.append("caseNumber", caseId);
    fileData.append("docType", documentType);
    fileData.append("docName", documentName);

    fileUpDownAxios
      .post("/downloadFile", fileData, { responseType: "blob" })
      .then((response) => {
        const docName = documentName;
        const filename = `${documentType}_${caseId}${docName.substring(
          docName.lastIndexOf(".")
        )}`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const lastIndex = docName.lastIndexOf(".");
        const fileType = docName.slice(lastIndex + 1);
        if (restrictedFileTypes.includes(fileType)) {
          Swal.fire({
            icon: "error",
            title: "This FileType Is Not Visible In The Browser",
          });
          return;
        }

        setDocViewDialog({
          ...docViewDialog,
          open: true,
          fileName: filename,
          fileType: fileType,
          url: url,
        });
      })
      .catch((err) => {
        printConsole("Caught in download file: ", err);
        alert("Failed to download File");
      });
  };

  const handleModalShowHide = (index, flagValue, requestedFrom) => {
    if (requestedFrom === "Close") {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }
    let unique = [...documentData];
    unique = convertArrayToOuterArray(unique);
    let documentName =
      unique[index]?.["documentType"] === undefined
        ? ""
        : unique[index]["documentType"];
    console.log("Inside handleModalShowHide documentName: ", documentName);
    if (documentName === "") {
      alert("Please select Document Name first");
      selectRef.current.focus();
    } else {
      let docIndexJson = { ...docClickedIndex.current };
      docIndexJson.FileUpload = index;
      docClickedIndex.current = docIndexJson;

      setModalShow({ ...modalShow, FileUpload: flagValue });
    }
  };

  const handleFileUpload = (evnt, index) => {
    if (evnt.target.files[0] === undefined) {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }

    if (evnt.target.files[0] !== undefined) {
      setFileState([
        ...fileState,
        { selectedFile: evnt.target.files[0], fileIndex: index },
      ]);
    }
  };

  const docFunction = () => {
    let getDocJson = {};
    getDocJson["option"] = "GETPDMDOCUMENTS";
    getDocJson["Type"] = props.selectedType;
    getDocJson["ProviderId"] = props.providerId;
    getDocJson["ContractId"] = props.contractId;
    getDocJson["SearchType"] = props.searchType;
    printConsole("Inside DocumentTab docFunction get api INput: ", getDocJson);
    customAxios
      .post("/generic/callProcedure", getDocJson)
      .then((res) => {
        res = res.data.CallProcedure_Output;
        if (res.Status === 0) {
          const respData = [...res.data];

          let newArray = [];
          let caseArray = [];
          respData.forEach((js) => {
            const newDocJson = convertToDateObj(js);
            if (newDocJson.caseNumber === 0) {
              newArray.push(newDocJson);
            } else {
              caseArray.push(newDocJson);
            }
          });
          setDocumentData(newArray);
          setCaseDocuments(caseArray);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const documentUploadData = () => {
    if (documentData.length > 0) {
      let unique = [...documentData];
      unique = convertArrayToOuterArray(unique);

      return unique.map((data, index) => {
        return (
          <>
            {data.caseNumber === 0 && (
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
                  {data.documentType == undefined ? (
                    <Select
                      ref={selectRef}
                      options={documentNameValues}
                      onChange={(selectValue, event) =>
                        handleGridSelectChange(
                          index,
                          selectValue,
                          event,
                          unique
                        )
                      }
                      name="documentType"
                      id="documentType"
                    />
                  ) : (
                    data.documentType
                  )}
                </td>
                <td>{data.documentName}</td>
                <td>{data.sno === undefined ? "Manual" : data.source}</td>
                <td>
                  {data.documentType !== undefined &&
                  data.documentType === "Other Documents" &&
                  data.documentName !== undefined ? (
                    ""
                  ) : (
                    <img
                      id="w9DocUploadImage"
                      src={documentUploadImage}
                      className="img-fluid"
                      alt="..."
                      style={{ height: "30px", background: "inherit" }}
                      onClick={() => handleModalShowHide(index, true)}
                    ></img>
                  )}
                </td>
                <td>
                  <img
                    id="w9DocDownloadImage"
                    src={documentDownloadImage}
                    className="img-fluid"
                    alt="..."
                    style={{ height: "30px", background: "inherit" }}
                    onClick={() =>
                      downloadFile(index, unique, unique[index].caseNumber)
                    }
                  ></img>
                </td>
                <td>
                  {data.uploadedDateTime === undefined ? "Pending" : "Uploaded"}
                </td>
                <td>
                  {data.documentType !== "Other Documents" && (
                    <img
                      id="viewDocImage"
                      src={viewDocumentImage}
                      className="img-fluid"
                      alt="..."
                      style={{ height: "30px", background: "inherit" }}
                      onClick={() => showVersion(index, "Upload")}
                    ></img>
                  )}
                </td>
                <td>
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
                      downloadedfileBlob(index, unique);
                    }}
                  ></i>
                </td>
              </tr>
            )}
          </>
        );
      });
    }
  };

  //Added by Harshit wrt document versions.
  const convertArrayToOuterArray = (arr) => {
    let newArray = [...arr];
    newArray.sort((a, b) =>
      a.uploadedDateTime < b.uploadedDateTime
        ? 1
        : b.uploadedDateTime < a.uploadedDateTime
        ? -1
        : 0
    );

    const unique = newArray.filter((obj, index) => {
      if (
        obj.documentType === "Other Documents" ||
        obj.documentType === undefined
      ) {
        return obj;
      } else {
        return (
          index ===
          newArray.findIndex(
            (o) =>
              obj.documentType === o.documentType &&
              obj.caseNumber === o.caseNumber
          )
        );
      }
    });
    return unique;
  };

  const showVersion = (index, requestedType) => {
    if (requestedType !== undefined) {
      if (requestedType === "Upload") {
        setVersionDocuments(documentData);
      }

      if (requestedType === "Download") {
        setVersionDocuments(caseDocuments);
      }
    }
    let docIndexJson = { ...docClickedIndex.current };
    docIndexJson.Version = index;
    docClickedIndex.current = docIndexJson;
    setModalShow({ ...modalShow, Version: true });
  };

  const documentsDownloadData = () => {
    if (caseDocuments.length > 0) {
      let unique = [...caseDocuments];
      unique = convertArrayToOuterArray(unique);

      return unique.map((data, index) => {
        return (
          <>
            {data.caseNumber !== 0 && data.caseNumber !== undefined && (
              <tr key={index}>
                <td className="tableData">{data.documentType}</td>
                <td>{data.documentName}</td>

                <td>{data.caseNumber}</td>

                <td>
                  <img
                    id="w9DocDownloadImage"
                    src={documentDownloadImage}
                    className="img-fluid"
                    alt="..."
                    style={{ height: "30px", background: "inherit" }}
                    onClick={() => downloadFile(index, unique)}
                  ></img>
                </td>

                <td>{data.sno == undefined ? "Manual" : data.source}</td>

                <td>
                  {data.documentType !== undefined &&
                  data.documentType === "Other Documents" &&
                  data.documentName !== undefined ? (
                    ""
                  ) : (
                    <img
                      id="viewDocImage"
                      src={viewDocumentImage}
                      className="img-fluid"
                      alt="..."
                      style={{ height: "30px", background: "inherit" }}
                      onClick={() => showVersion(index, "Download")}
                    ></img>
                  )}
                </td>

                <td>
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
                      downloadedfileBlob(index, unique);
                    }}
                  ></i>
                </td>
              </tr>
            )}
          </>
        );
      });
    }
  };

  return (
    <div className="container">
      <div className="accordion">
        {props?.searchType.toLowerCase() === 'selfservice' && 
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordionButtonStyle disableElements"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#upload"
              aria-expanded="true"
              aria-controls="upload"
            >
              Upload
            </button>
          </h2>
          <div
            id="upload"
            className="accordion-collapse collapse show"
            aria-labelledby="upload"
          >
            <div className="accordion-body">
              <table
                class="table table-bordered tableLayout"
                style={{ textAlign: "center" }}
              >
                <thead>
                  <tr className="tableRowStyle tableHeaderColor">
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
                      Source
                    </th>

                    <th style={{ width: "10%" }} scope="col">
                      Upload
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      Download
                    </th>
                    <th>Status</th>
                    <th style={{ width: "10%" }} scope="col">
                      Version
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>{documentUploadData()}</tbody>
              </table>
            </div>
          </div>
        </div>
         }
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordionButtonStyle disableElements"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#download"
              aria-expanded="true"
              aria-controls="download"
            >
              Download
            </button>
          </h2>
          <div
            id="download"
            className="accordion-collapse collapse show"
            aria-labelledby="download"
          >
            <div className="accordion-body">
              <table
                class="table table-bordered tableLayout"
                style={{ textAlign: "center" }}
              >
                <thead className="backGroundColor">
                  <tr className="tableRowStyle tableHeaderColor">
                    <th style={{ width: "20%" }} scope="col">
                      Document Name
                    </th>
                    <th scope="col">FileName</th>
                    <th scope="col">Case Number</th>
                    <th>Download</th>
                    <th style={{ width: "10%" }} scope="col">
                      Source
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      Version
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>{documentsDownloadData()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalShow.FileUpload && (
        <FileUpload
          modalShow={modalShow.FileUpload}
          handleModalShowHide={handleModalShowHide}
          handleFileUpload={handleFileUpload}
          uploadFile={uploadFile}
          currIndex={docClickedIndex.current.FileUpload}
          documentData={documentData}
        />
      )}

      {modalShow.Version && (
        <DocumentVersion
          modalShow={modalShow}
          docData={versionDocuments}
          clickedIndex={docClickedIndex.current.Version}
          setModalShow={setModalShow}
          convertArrayToOuterArray={convertArrayToOuterArray}
        >
          {" "}
        </DocumentVersion>
      )}
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
  );
}
