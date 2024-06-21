
import React,{ useEffect, useRef, useState } from 'react'
import Select from 'react-select';
import documentDownloadImage from '../../../Images/DocumentDownloadImage.png'
import documentUploadImage from '../../../Images/DocumentUploadImage.png';
// import axios from 'axios';
import {useAxios} from '../../../api/axios.hook';
import { useLocation} from 'react-router-dom';
import FileUpload from '../../../WorkItemDashboard/DashboardFileUpload/FileUpload';

export default function DecisionAnciTab() {

    const [modalShow, setModalShow] = useState(false);

    const [fileState,setFileState] = useState({selectedFile:null});

    const[documentData, setDocumentData] = useState([]);

    const docClickedIndex = useRef();

    const {customAxios:axios} = useAxios();

    //const {handleSelectChange,handleLinearFieldChange} = useUpdateDecision();

    let prop = useLocation();

    const [decisionState,setDecisionState] = useState({decisionNotes:''});

    const handleSelectChange = (selectedValue,evnt) => {
        console.log("Decision Value selectedValue: ",selectedValue);
        console.log("Decision Value event: ",evnt);
        const { name } = evnt;
        if(name === 'decision'){
            prop.state.decision = selectedValue.value;
        }
        setDecisionState({...decisionState,[name]:selectedValue});
    }

    const handleLinearFieldChange = (evt) => {
        const value = evt.target.value;
        if(evt.target.name === 'decisionNotes'){
            prop.state.decisionNotes = evt.target.value;
        }
        setDecisionState({
            ...decisionState,
            [evt.target.name]: evt.target.value
        })
    }


    const handleModalShowHide = (index,flagValue) => {
        console.log("Index Value= ",index);
        docClickedIndex.current = index;
        console.log("docClickedIndex.current: ",docClickedIndex.current);
        setModalShow(flagValue);
    }

    const handleFileUpload = (evnt) => {
        if(evnt.target.files[0] === undefined){
            setFileState({selectedFile:null});
        }

        if(evnt.target.files[0] !== undefined){
            setFileState({selectedFile:evnt.target.files[0]});
        }
    }

    const uploadFile = (index) => {
        console.log("File Upload State: ",documentData[index]);
        if(fileState.selectedFile !== null){
            const fileData = new FormData();
            const caseId = Number(prop.state.caseNumber);
            const documentType = documentData[index].documentName.value;
            fileData.append('file', fileState.selectedFile);
            fileData.append('caseNumber', caseId);
            fileData.append('docType', documentType);
            console.log("File Upload Data: ",fileData)
            axios.post("http://localhost:8081/dashboard/api/uploadFile",fileData).then((res) => {
                console.log("api response: ",res.data);
                if(res.status===200){
                    alert("Document Uploaded Successfully");
                    setFileState({selectedFile:null});
                    handleModalShowHide(false);
                }
                if(res.status===""){
                    alert("Error in uploading file");
                }
            });
        }
    }

    const downloadFile = (index) => {
        const caseId = Number(prop.state.caseNumber);
        const documentType = documentData[index].documentName.value;
        const apiUrl = "http://localhost:8081/dashboard/api/downloadFile/"+caseId+'/'+documentType;
        axios.get(apiUrl).then((response) => {
                console.log("Download api response: ",response);
                console.log("fileName: ",response.headers);
                const filename =  response.headers.get('Content_Disposition').split('filename=')[1];
                response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                console.log("Url: ",url);
                let a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            });
        });
    }

    const hourOptions = [
        { value: 'Submit', label: 'Submit' },
        { value: 'Discard', label: 'Discard' }
    ];


    const documentInfo = [
        {documentName:{label: "Document1", value:"Document1"}},
        {documentName:{label: "Document2", value:"Document2"}},
        {documentName:{label: "Document3", value:"Document3"}},
        {documentName:{label: "Document4", value:"Document4"}}
    ]

    useEffect (() => {
        getAllDocuments();
    },[])

    const getAllDocuments = () => {
        setDocumentData(documentInfo);
    }

    const decsHistoryData = () => {
        return (
            <>
                <table class="table table-bordered tableLayout">
                <thead>
                  <tr className='tableRowStyle tableHeaderColor'>
                    <th scope="col">User Name</th>
                    <th scope="col">Workstep Name</th>
                    <th scope="col">Case Decision</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Entry Date Time</th>
                    <th scope="col">Exit Date Time</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </>
        )
    }

    const contractData = () => {
        return (
            <>
                <table class="table table-striped table-bordered tableLayout">
                <thead>
                  <tr className='tableRowStyle tableHeaderColor'>
                    <th scope="col">Operation</th>
                    <th scope="col">Action Date Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Comments</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </>
        )
    }
    const documentsData = () => {
        console.log("documentData: ",documentData);
        if(documentData.length>0){
            return documentData.map((data,index) => {
                return (
                    <>
                        <tr key={index}>
                            <td className='tableData'>
                                {(('documentName' in data) && (data.documentName.value !== undefined)) ? (data.documentName.value) : (data.documentName)}
                            </td>
                            <td>
                                <img id = 'w9DocUploadImage' src = {documentUploadImage} className="img-fluid" alt="..."
                                style={{height:"30px",background:"inherit"}} onClick={() => handleModalShowHide(index,true)}></img>
                            </td>
                            <td>
                                <img id ='w9DocDownloadImage' src = {documentDownloadImage} className="img-fluid" alt="..."
                                style={{height:"30px",background:"inherit"}} onClick={()=> downloadFile(index)}></img>
                            </td>
                        </tr>
                    </>
                )
            })
        }
    }

  return (
    <>
        <div className="DecisionTab">
            <div className="Container">
                <div className="accordion AddProviderLabel" id="accordionPanelsStayOpenExample">

                {/* {mainWIObject.flowId =="1" ? (     */}
                <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingContract">
                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseContract" aria-expanded="true" aria-controls="panelsStayOpen-collapseContract">
                                Contract
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseContract" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingContract">
                                    <div className="accordion-body">
                                    <div className="row my-2">
                                            <div className="col-sm mx-1">
                                            <button style={{width:"70%"}} type="button"className="btn btn-outline-primary btnStyle">Contract Selection</button>
                                            </div>
                                            <div className="col-sm mx-1">
                                            <button style={{width:"70%"}} type="button" className="btn btn-outline-primary btnStyle">Final Contract</button>
                                            </div>
                                            <div className="col-sm mx-1">
                                            <button style={{width:"70%"}} type="button" className="btn btn-outline-primary btnStyle">E-Sign</button>
                                            </div>
                                            <div className="col-sm mx-1">
                                            <button style={{width:"70%"}} type="button" className="btn btn-outline-primary btnStyle">Doc Status</button>
                                            </div>
                                            <div className="col-sm mx-1">
                                            <button style={{width:"70%"}} type="button" className="btn btn-outline-primary btnStyle">Send Reminder</button>
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-xs-6 col-md-12">
                                            {contractData()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ): (<div/>)} */}

                 <div className="accordion-item">
                 <h2 className="accordion-header" id="panelsStayOpen-headingNotes">
                 <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseNotes" aria-expanded="true" aria-controls="panelsStayOpen-collapseNotes">
                 Notes
                 </button>
                 </h2>
                 <div id="panelsStayOpen-collapseNotes" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingNotes">
                    <div className="accordion-body">
                    <div className="row">
                        <div className="col-xs-12 col-md-4">
                            <label>Decision</label>
                            <Select

                                onChange={(selectValue,event)=>(handleSelectChange(selectValue, event))}
                                options={hourOptions}
                                name = "decision"
                                id = "decisionDropdown"
                            />
                        </div>
                        </div>

                        <div className="row my-2">
                        <div className="col-xs-12">
                        <label>Decision Notes:</label>
                        <textarea onChange={handleLinearFieldChange} style={{width:"100%"}} name="decisionNotes"/>
                        </div>
                        </div>

                        <div className="row my-2">
                        <div className="col-xs-12">
                        <button type="button" className="btn btn-outline-primary btnStyle">Save Only Office Changes</button>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>



                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingDocuments">
                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseDocuments" aria-expanded="true" aria-controls="panelsStayOpen-collapseDocument">
                                Documents
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseDocuments" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingDocuments">
                                    <div className="accordion-body">
                                    <table class="table table-bordered tableLayout" style={{textAlign:"center"}} id="DocumentsTable">
                                        <thead>
                                        <tr className='tableRowStyle tableHeaderColor'>
                                            <th scope="col">Document Name</th>
                                            <th scope="col">Upload</th>
                                            <th scope="col">Download</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {documentsData()}
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingDecHistory">
                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseDecHistory" aria-expanded="true" aria-controls="panelsStayOpen-collapseDecHistory">
                                Decision History
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseDecHistory" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingDecHistory">
                                    <div className="accordion-body">
                                    <div className="row my-2">
                                            <div className="col-xs-6 col-md-12">
                                            {decsHistoryData()}
                                            </div>
                                    </div>
                                    </div>
                                </div>
                            </div>


            </div>
        </div>
        <FileUpload modalShow={modalShow} handleModalShowHide={handleModalShowHide}
        handleFileUpload={handleFileUpload} uploadFile={uploadFile} currIndex={docClickedIndex.current}/>
        </div>
    </>
  )
}
