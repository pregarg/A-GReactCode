import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios';

import "../TileFormsCss/AddProvider.css";
import documentDownloadImage from "../../../Images/DocumentDownloadImage.png";
import documentUploadImage from "../../../Images/DocumentUploadImage.png";
import BulkHealthFileUpload from "../TileFormModals/BulkHealthFileUpload";

import { useAxios } from "../../../api/axios.hook";
import { useSelector } from "react-redux";
import FooterComponent from "../../FooterComponent";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import readFile from "../../CustomHooks/useFileReader";
import MuiStepper from "./MuiStepper";

export default function BulkHealth() {
  const navigate = useNavigate();
  const { rosterAxios } = useAxios();
  //   const {customAxios:axios} = useAxios();
  const token = useSelector((state) => state.auth.token);

  const mastersSelector = useSelector((masters) => masters);
  console.log("Masters Selector: ", mastersSelector);
  const masterUserName = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("userName")
      ? mastersSelector.auth.userName
      : "system"
    : "system";
  let location = useLocation();
  const indexRef = useRef({
    index: 0,
    errorString: "",
  });

  //const [docClickedIndex, setIndex] = useState(-1);
  const docClickedIndex = useRef();

  const navigateHome = () => {
    console.log("Inside navigate Home");
    navigate("/Home", { replace: true });
  };

  const gridDocumentList = [
    { documentName: "Roster" },
    { documentName: "W9 Document" },
    { documentName: "Contract" },
  ];

  const [modalShow, setModalShow] = useState(false);

  const [fileState, setFileState] = useState([]);

  const [rosterTypeState, setRosterTypeState] = useState("");

  const [helperText, setHelperText] = useState("");
  const [openStepper, setOpenStepper] = React.useState(false);

  const [extractedDocuName, setextractedDocuName] = useState({});

  const isRosterUploaded = useRef(false);

  let randomNumber = location.state.randomNumber;

  useEffect(() => {}, []);

  const handleModalShowHide = (flagValue, index, requestedForm) => {
    setModalShow(flagValue);
    //setIndex(index);
    docClickedIndex.current = index;
    let indexToDelete = fileState.findIndex((item) => item.fileIndex === index);
    console.log("cicked index", index, requestedForm);
    if (requestedForm === "close") {
      if (indexToDelete !== -1) {
        fileState.splice(indexToDelete, 1);
      }
      // }
      //setFileState([...fileState, { selectedFile: null, fileIndex: index, documentType: documentName }]);
    }
    if (requestedForm === "upload") {
      console.log("uploaded file state", fileState);
      let updatedExtractedDocuName = { ...extractedDocuName };
      if (indexToDelete !== -1) {
        let fileAtIndex = fileState[indexToDelete];
        let documentName = gridDocumentList[index].documentName.trim();
        updatedExtractedDocuName[documentName] = fileAtIndex.selectedFile.name;
        setextractedDocuName(updatedExtractedDocuName);
      }
      setTimeout(() => {
        console.log("extracted document name", extractedDocuName);
      }, 200);
    }
  };

  const handleFileUpload = (evnt, index) => {
    console.log("Inside handleFileUpload Index: ", index);
    let fileStateCopy = [...fileState];
    if (evnt.target.files[0] === undefined) {
      fileStateCopy.push({
        selectedFile: null,
        fileIndex: index,
        documentType: null,
      });
      // setFileState([
      //   ...fileState,
      //   { selectedFile: null, fileIndex: index, documentType: null },
      // ]);
    }

    if (evnt.target.files[0] !== undefined) {
      let indexofFile = fileStateCopy.findIndex(
        (item) => item.fileIndex === index,
      );
      const documentName = gridDocumentList[index].documentName.trim();

      if (documentName === "Roster") {
        const fileExt = evnt.target.files[0].name.split(".").pop();

        if (fileExt !== "xls" && fileExt !== "xlsx") {
          alert("File type not supported");
          handleModalShowHide(false, index);
          return;
        }
        setOpenStepper(true);
        console.log("ReadFile", evnt.target.files[0]);
        readFile(
          evnt.target.files[0],
          rosterTypeState,
          (error, isValidFile, currentStep) => {
            indexRef.current.index = currentStep;
            indexRef.current.errorString = error;
            console.log("error", error);
            if (error) {
              setFileState([]);
              handleModalShowHide(false, index);
              return;
            }

            if (isValidFile) {
              if (indexofFile !== -1) {
                fileStateCopy[indexofFile] = {
                  selectedFile: evnt.target.files[0],
                  fileIndex: index,
                  documentType: documentName,
                };
                setFileState(fileStateCopy);
              } else {
                fileStateCopy.push({
                  selectedFile: evnt.target.files[0],
                  fileIndex: index,
                  documentType: documentName,
                });
                setFileState(fileStateCopy);
              }
              // setFileState([
              //   ...fileState,
              //   {
              //     selectedFile: evnt.target.files[0],
              //     fileIndex: index,
              //     documentType: documentName,
              //   },
              // ]);
            }
          },
        );
      } else {
        if (indexofFile !== -1) {
          fileStateCopy[indexofFile] = {
            selectedFile: evnt.target.files[0],
            fileIndex: index,
            documentType: documentName,
          };
          setFileState(fileStateCopy);
        } else {
          fileStateCopy.push({
            selectedFile: evnt.target.files[0],
            fileIndex: index,
            documentType: documentName,
          });
          setFileState(fileStateCopy);
        }
      }
      //setFileState(fileStateCopy);
    }
  };

  /*const uploadFile = (index) => {
        console.log("Inside Upload File: ",randomNumber);
        let fileArray = [...fileState];
        let selectedFile = null;
        fileArray.forEach(el => {
        if(el.fileIndex === index){
            selectedFile = el.selectedFile;
        }
        })

        if(selectedFile !== null){
            const documentType = gridDocumentList[index].documentName.trim();
            const fileData = new FormData() 
            fileData.append('file', selectedFile);
            fileData.append('caseNumber', randomNumber);
            fileData.append('dirName', documentType);
            fileData.append('userName', masterUserName);
            
            console.log("File Upload Data: ",fileData)

            rosterAxios.post("/uploadFile",fileData,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
                console.log("api response: ",res.data);
                if(res.data.fileName !== "Failed"){
                    
                    if(documentType === 'Roster'){
                        alert("Your file has been uploaded. Please check your cases on dashboard after some time.");
                        isRosterUploaded.current = true;
                    }
                    else{
                        alert("Your document has been uploaded");
                    }
                    
                    setFileState([]);
                    handleModalShowHide(false,index);
                }
                if(res.data.fileName === "Failed"){
                    alert("Error in uploading file");
                }
            });
        }
    }*/
  //Implementation changed by Harshit Sharma wrt "Upload all documents together on click of button"
  const uploadFile = async () => {
    console.log("Inside Upload File: ", randomNumber);
    console.log("file state", fileState);
    let docuName = fileState.map((elem) => {
      return elem.documentType;
    });
    console.log("docuname", docuName, docuName.documentType);
    if (docuName.includes("Roster")) {
      if (rosterTypeState.trim() !== "") {
        let fileArray = [...fileState];
        let selectedFile = null;

        await Promise.all(
          fileState.map(async (el, index) => {
            console.log(index);
            selectedFile = el.selectedFile;
            if (selectedFile !== null) {
              const documentType = el.documentType;
              const fileData = new FormData();
              fileData.append("file", selectedFile);
              fileData.append("caseNumber", randomNumber);
              fileData.append("dirName", documentType);
              fileData.append("userName", masterUserName);
              fileData.append("rosterType", rosterTypeState);
              console.log("File Upload Data: ", fileData);
              //console.log("File Upload Data array: ",fileArray)
              try {
                await rosterAxios
                  .post("/uploadFile", fileData, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then((res) => {
                    console.log("api response: ", res);
                    if (res.status === 200) {
                      fileArray.splice(0, 1);
                    }
                  })
                  .catch((exception) => {
                    console.log("Inside catch exception: ", exception);
                    alert(exception.response.data.status);
                  });
              } catch (error) {
                console.log("Exception occured while uploading files ", error);
              }
            }
          }),
        );

        console.log("Final Array after splice and for each: ", fileArray);

        //setTimeout(() => {
        if (fileArray.length === 0) {
          alert("All Documents uploaded successfully");
          setFileState([]);
          navigateHome();
        } else {
          let alertStr = "Error in Uploading documents:\n";
          let i = 1;
          fileArray.forEach((elem) => {
            alertStr += i + ". " + elem.documentType + "\n";
            i++;
          });
          alert(alertStr);
        }
        // },2000)
      } else {
        setHelperText("Please Choose Roster Type");
      }
    } else {
      alert("Please upload roster first.");
    }
  };

  const tdData = () => {
    if (gridDocumentList.length > 0) {
      return gridDocumentList.map((data, index) => {
        return (
          <tr key={index}>
            <td>{data.documentName}</td>
            {data.documentName === "Roster" && isRosterUploaded.current ? (
              <td>Roster has been uploaded for this session.</td>
            ) : (
              <td>
                <img
                  id="rosterDocUploadImage"
                  src={documentUploadImage}
                  className="img-fluid"
                  alt="..."
                  onClick={() => {
                    if (rosterTypeState === "") {
                      alert("Please Select Roster Type.");
                    } else {
                      handleModalShowHide(true, index);
                    }
                  }}
                  style={{ height: "30px", background: "inherit" }}
                ></img>
              </td>
            )}
            {/* <td>
                        <img id ='rosterDocUploadImage' src = {documentUploadImage} className="img-fluid" alt="..."
                        onClick={()=>handleModalShowHide(true,index)} style={{height:"30px",background:"inherit"}}></img>
                        </td> */}
            <td>
              <img
                id="rosterDocDownloadImage"
                src={documentDownloadImage}
                className="img-fluid"
                alt="..."
                style={{ height: "30px", background: "inherit" }}
              ></img>
            </td>
            <td>{extractedDocuName[data.documentName]}</td>
          </tr>
        );
      });
    }
  };

  const rosterTypeOnChange = (evnt, val) => {
    const rosterType = evnt.target.value;
    console.log("Inside rosterTypeOnChange handle change===== ", rosterType);
    console.log("Inside rosterTypeOnChange handle change value===== ", val);
    setRosterTypeState(evnt.target.value);
    if (helperText !== "") {
      setHelperText("");
    }
  };

  return (
    <>
      <div className="BulkHealth backgroundColor">
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                onClick={(event) => navigateHome(event)}
                style={{ float: "left", marginLeft: "10px" }}
              >
                Go To Home
              </button>
              <label id="tileFormLabel" className="HeadingStyle">
                Bulk Health System Load
              </label>
            </div>
          </div>
        </div>
        <br />
        <div
          className="container"
          style={{ overflow: "auto", height: "auto", minHeight: "100%" }}
        >
          <div
            className="accordion RosterTypeLabel"
            id="accordionRosterTypePanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="rosterTypePanelsStayOpen-Administrative"
              >
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#rosterTypePanelsStayOpen-collapseAdministrative"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Roster Type
                </button>
              </h2>
              <div
                id="rosterTypePanelsStayOpen-collapseAdministrative"
                className="accordion-collapse collapse show"
                aria-labelledby="rosterTypePanelsStayOpen-Administrative"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-xs-6">
                      <FormControl
                        sx={{ m: 3 }}
                        error={helperText.trim() === "" ? true : false}
                        variant="standard"
                      >
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          //defaultValue="nondelegated"
                          name="radio-buttons-group"
                          onChange={(event, value) =>
                            rosterTypeOnChange(event, value)
                          }
                        >
                          <FormControlLabel
                            value="delegated"
                            control={<Radio />}
                            label="Delegated"
                          />
                          <FormControlLabel
                            value="nondelegated"
                            control={<Radio />}
                            label="Non-Delegated"
                          />
                        </RadioGroup>

                        <FormHelperText>{helperText}</FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="accordion AddProviderLabel"
            id="accordionPanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="panelsStayOpen-Administrative"
              >
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseAdministrative"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Standard
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseAdministrative"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-Administrative"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-xs-6">
                      <table
                        className="table table-striped table-bordered"
                        style={{ textAlign: "center" }}
                      >
                        <thead>
                          <tr className="tableRowStyle">
                            <th scope="col">Type</th>
                            <th scope="col">Upload</th>
                            <th scope="col">Download</th>
                            <th scope="col">Uploaded File Name</th>
                          </tr>
                        </thead>
                        <tbody>{tdData()}</tbody>
                      </table>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ marginBottom: "30px" }}
                    className="btn btn-success"
                    disabled={fileState.length > 0 ? false : true}
                    onClick={() => uploadFile()}
                  >
                    Upload Documents
                  </button>

                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MuiStepper
          openStepper={openStepper}
          onClose={() => {
            indexRef.current = {
              index: 0,
              errorString: "",
            };

            setOpenStepper(false);
          }}
          currentStep={indexRef?.current?.index}
          stepErrors={indexRef?.current?.errorString}
        />
        <BulkHealthFileUpload
          modalShow={modalShow}
          handleModalShowHide={handleModalShowHide}
          handleFileUpload={handleFileUpload}
          uploadFile={uploadFile}
          clickedIndex={docClickedIndex.current}
        />
        {/* <footer className='footerStyle'>
            <div className="content-wrapper">
                <div className='float-left'>
                    <h6></h6>
                </div>
            </div>
        </footer> */}
        <FooterComponent />
      </div>
    </>
  );
}
