import React, { useEffect, useRef, useState } from "react";
import documentDownloadImage from "../../Images/DocumentDownloadImage.png";
import documentUploadImage from "../../Images/DocumentUploadImage.png";
import Select, { StylesConfig } from "react-select";
import { useSelector } from "react-redux";
import FileUpload from "../../WorkItemDashboard/DashboardFileUpload/FileUpload";
import useUpdateDecision from "../CustomHooks/useUpdateDecision";
import useSwalWrapper from "../../Components/SweetAlearts/hooks"
import { useAxios } from "../../api/axios.hook";
import DocumentViewer from "../../Components/CommonComponents/DocumentViewer";



export default function DocumentSection(prop) {

  
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
  const downloadedfileBlob = (index, documentData) => {
    const {caseNumber,documentType, documentName, docUploadPath } =
      documentData[index] || {};

    if (!documentType && !documentName) {
      Swal.fire({
        icon: "error",
        title: "Please Upload The File First",
      });
      return;
    }
    let newArray = [...documentData];
    const convertArrayToOuterArray = (arr) => {
      let newArray = [...arr];
      newArray.sort((a, b) =>
        a.uploadedDateTime < b.uploadedDateTime
          ? 1
          : b.uploadedDateTime < a.uploadedDateTime
            ? -1
            : 0
      );
      //filtering results by documentType and fetching result of each documentType
  
      const unique = newArray.filter((obj, index) => {
        if (obj.documentType !== "Other Documents") {
          return (
            index ===
            newArray.findIndex((o) => obj.documentType === o.documentType)
          );
        } else {
          return obj;
        }
      });
      return unique;
    };
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
        const filename = `${documentType}_${docName.substring(
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
        alert("Please upload the file first1234");
      });
  };

  // const customStyles: StylesConfig = {
  //   control: (provided: Record<string, unknown>, state: any) => ({
  //     ...provided,
  //     height: 52,
  //     border: state.isFocused ? "1px solid #ff8b67" : "1px solid #cccccc",
  //     boxShadow: state.isFocused ? "0px 0px 6px #ff8b67" : "none",
  //     // "&": {
  //     //   border: "1px solid #cccccc",
  //     //   boxShadow: "none"
  //     // },
  //     // "&:hover": {
  //     //   border: "1px solid #ff8b67",
  //     //   boxShadow: "0px 0px 6px #ff8b67"
  //     // }
  //     // "&:focus": {
  //     //   border: "1px solid #ff8b67",
  //     //   boxShadow: "0px 0px 6px #ff8b67"
  //     // },
  //     // "&:acitve": {
  //     //   border: "1px solid #ff8b67",
  //     //   boxShadow: "0px 0px 6px #ff8b67"
  //     // }
  //   }),
  // };
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
  const mastersSelector = useSelector((masters) => masters);
  console.log("Document Masters Selector: ", mastersSelector);

  const [modalShow, setModalShow] = useState(false);

  const [fileState, setFileState] = useState([]);

  const [documentNameValues, setDocumentNameValues] = useState([]);
  const [documentData, setDocumentData] = useState([]);

  useEffect(() => {
    const stageName = prop.stageName || prop.stageName.trim();
    if (mastersSelector.hasOwnProperty("masterAngDocument")) {
      let documentOptions =
        mastersSelector["masterAngDocument"].length === 0
          ? []
          : mastersSelector["masterAngDocument"][0];
      console.log("Document Section documentOptions: ", documentOptions);
      console.log("Document Section stagename: ", stageName);
      if (documentOptions.length > 0) {
        documentOptions = documentOptions.filter(
          (elem) => 
          elem.WORKSTEP_NAME.trim().toLowerCase() == stageName.trim().toLowerCase()
        );
        console.log(
          "Document Section documentOptions after filter: ",
          documentOptions
        );
        let newDocumentValues = [];
        documentOptions.forEach((element) => {
          let sJson = {};
          sJson.label = element.DOCUMENT_NAME;
          sJson.value = element.DOCUMENT_NAME;
          //console.log("DocumentSection sJSON: ", sJson);
          // newDocumentValues = [...documentNameValues];
          // console.log(
          //   "Document Section newDocumentValues before: ",
          //   newDocumentValues
          // );
          newDocumentValues.push(sJson);
          // console.log(
          //   "Document Section newDocumentValues after: ",
          //   newDocumentValues
          // );
        });
        setDocumentNameValues(newDocumentValues);
      }
    }
  }, []);
  
  

  const handleGridSelectChange = (index, selectedValue, documentName) => {
    //console.log("Inside handleGridSelectChange");
    let rowsInput = "";
    const { name } = documentName;
    rowsInput = [...documentData];
    //console.log("Inside handle slect change rowsInput: ", rowsInput);
    rowsInput[index][name] = {
      label: selectedValue.value,
      value: selectedValue.value,
    };
    // console.log(
    //   "rowsInput inside handleGridSelectChange",
    //   rowsInput[index][name]
    // );
    setDocumentData(rowsInput);
    
    console.log("documentData handleGridSelectChange", documentData);
  };

  const uploadFile = (paramData, index) => {
    printConsole("Inside uploadFile index: ", index);
    printConsole("File Upload State: ", paramData);
    printConsole("File State: ", fileState);
    //console.log("Document data file name: ",fileState.selectedFile.name);
    let fileJson = {};
    let selectedFile = null;
    fileState.forEach(el => {
      if(el.fileIndex === index){
        selectedFile = el.selectedFile;
      }
    })
    printConsole('Selected file on index: ',selectedFile);
    if(selectedFile !== null){
      fileJson.fileData = selectedFile;
      fileJson.documentType = paramData[index].documentType.value;
      fileJson.docStatus = "Uploaded";
      fileJson.documentName = selectedFile.name;
      prop.fileDataRef[index] !== undefined
        ? (prop.fileDataRef[index] = fileJson)
        : prop.fileDataRef.push(fileJson);
      //prop.fileDataRef.push(fileJson);
      modifyDocumentValues(fileJson.documentType,'remove');
      let docJson = documentData[index];
      docJson.docStatus = "Uploaded";
      docJson.documentName = selectedFile.name;
      documentData[index] = docJson;
      setDocumentData(documentData);
      console.log("fileDataRef Updated: ", prop.fileDataRef);
      handleModalShowHide(index,false);
    }
    else{
      alert("Please first select document to upload.");
    }

    /*if(fileState.selectedFile !== null){
            const fileData = new FormData();
            //const caseId = Number(prop.state.caseNumber);
            const documentType = paramData[index].documentType;
            fileData.append('file', fileState.selectedFile);
            fileData.append('caseNumber', caseId);
            fileData.append('docType', documentType);
            console.log("File Upload Data: ",fileData)
            fileUpDownAxios.post("/uploadFile",fileData).then((res) => {
                console.log("api response: ",res.data);
                if(res.data.fileName !== "Failed"){
                    alert("File Uploaded Successfully");
                    docFunction();
                    setFileState({selectedFile:null});
                    handleModalShowHide(false);
                }
                if(res.data.fileName === "Failed"){
                    alert("Error in uploading file");
                }
            });
        }*/
  };

  const checkIfDocNameExists = (docName) => {
    let retFlag = false;
    if(documentNameValues.length > 0){
      documentNameValues.forEach((el) => {
        if(el.value === docName){
          retFlag = true;
          return;
        }
      })
      return retFlag;
    }
    else{
      return false;
    }
    
  }

  const modifyDocumentValues = (docValue, operValue) => {
    console.log("Inside modifyDocumentValues operValue: ",operValue, docValue);
    if(docValue !== '' && docValue !== 'Other Documents'){
    let newDocValue = [];
    if(operValue === 'add'){
      if(!checkIfDocNameExists(docValue)){
        newDocValue = [...documentNameValues];
        const newJson = {};
        newJson.label = docValue;
        //console.log('Inside modifyDocumentValues after label push json: ',newJson);
        newJson.value = docValue;
        //console.log('Inside modifyDocumentValues before push json: ',newJson);
        //console.log('Inside modifyDocumentValues before push: ',newDocValue);
        newDocValue.push(newJson);
        //console.log('Inside modifyDocumentValues after push: ',newDocValue);
        setDocumentNameValues(newDocValue);
      }
      
    }

    if(operValue === 'remove'){
      
      newDocValue = documentNameValues.filter((elem) => elem.value !== docValue);
      setDocumentNameValues(newDocValue);
    }
  }
  }
  const handleModalShowHide = (index, flagValue,requestedFrom) => {
    console.log("Index Value= ", index);
    if(requestedFrom === 'Close'){
      setFileState([...fileState,{ selectedFile: null, fileIndex : index }]);
    }
    let documentName =
      documentData[index]["documentType"] === undefined
        ? ""
        : documentData[index]["documentType"].value;
    
    console.log(
      "Inside Document Section handleModalShowHide documentName: ",
      documentName
    );
    console.log("Inside Document Section handleModalShowHide documentName is Focused: ",selectRef.current)
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
    if (evnt.target.files[0] === undefined) {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }

    if (evnt.target.files[0] !== undefined) {
      if (
        documentData[index].documentType === "Draft Contract" ||
        documentData[index].documentType === "Final Contract"
      ) {
        const fileExt = evnt.target.files[0].name.split(".").pop();
        if (fileExt !== "docx" && fileExt !== "doc") {
          alert("Only docx or doc file type supported.");
          evnt.target.value = null;
          return;
        }
      }
      setFileState([
        ...fileState,
        { selectedFile: evnt.target.files[0], fileIndex: index },
      ]);
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
    console.log("Inside delete table rows: ",tempRows[index]["documentType"]);
    const documentName = (tempRows[index]["documentType"]!==undefined)?tempRows[index]["documentType"].value:'';
    modifyDocumentValues(documentName,'add');
    tempRows.splice(index, 1);
    prop.fileDataRef.splice(index,1);
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
    let unique = [...documentData];
    //console.log("documentData.documentType: ",data['documentType']);

    if (documentData.length > 0) {
      console.log("Inside documentsData documentNameValues===== ",documentNameValues)
      return documentData.map((data, index) => {
        //data['documentType']= {label: data['documentType'], value: data['documentType']};
        //console.log("data: ", data);
        //console.log("documentData.documentType: ",data.documentType);
        //let newJson={};
        //newJson.docType={label: data.documentType, value: data.documentType};
        //console.log("newJson.docType: ",newJson);
        //data.documentType=newJson.docType;
        //console.log("data.documentType: ",data.documentType);
        return (
          <>
            <tr key={index}>
              {
                <>
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
                </>
              }

              <td className="tableData">
                {/* {data.documentType==undefined? */}
                {data.docStatus !== 'Uploaded'?
                <Select
                  //value={(('documentType' in data) && (data.documentType.value !== undefined)) ? (data.documentType.value) : (data.documentType)}
                  value={data.documentType}
                  styles={customStyles}
                  ref={selectRef}
                  menuPlacement={handleSelectItemPos() ? "top" : "auto"}

                  //options={documentNames}
                  options={documentNameValues}
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(index, selectValue, event)
                  }
                  name="documentType"
                  id="documentType"
                />
                : data.documentType.value}
                 
              </td>

              <td>{data.documentName}</td>
              <td>
                {/* {data.documentName==undefined? */}
                <img
                  id="w9DocUploadImage"
                  src={documentUploadImage}
                  className="img-fluid"
                  alt="..."
                  style={{ height: "30px", background: "inherit" }}
                  onClick={() => handleModalShowHide(index, true)}
                ></img>
                {/* :data.documentName} */}
              </td>
              {/* <td>
                                <img id ='w9DocDownloadImage' src = {documentDownloadImage} className="img-fluid" alt="..."
                                style={{height:"30px",background:"inherit"}} onClick={()=> downloadFile(index)}></img>
                            </td> */}
              <td>{data.docStatus}</td>
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
          </>
        );
      });
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
