import React,{ useState } from 'react'
import axios from 'axios';
import Select from 'react-select';
import GridModal from './GridModal';
import { getAuthToken } from "../../../util/auth";
import { useSelector } from 'react-redux';
import useGetDBTables from '../../CustomHooks/useGetDBTables';


export default function FIRLTable({firlTableRowsData,deleteTableRows, handleGridSelectChange, addTableRows,
    handleGridFieldChange, gridRowsFinalSubmit, lockStatus, editTableRows, gridFieldTempState}) {
        FIRLTable.displayName = "FIRLTable";
        //const [dataIndex,setDataIndex] = useState({operation:'',modalIndex:0});
        const [dataIndex,setDataIndex] = useState();
        const [operationValue,setOperationValue] = useState("");
        const [modalShow, setModalShow] = useState(false);
        //const apiUrl = 'http://localhost:8081/api';

        const { getGridJson,convertToCase } = useGetDBTables();

    let stateOptions = [];
    const [isTouched,setIsTouched] = useState({});

    let endpoints = [
        //apiUrl+'/master/stateSymbol'
      ];
      const stateMaster = useSelector(store => store.masterStateSymbol);
      //console.log("stateMaster :",stateMaster);
      const tdDataReplica = (index) => {
        //if(firlTableRowsData!==undefined && firlTableRowsData.length>0){
            const data = getGridJson(gridFieldTempState);
            stateMaster[0].map(val => stateOptions.push({value : val, label: val})); //Added by Nidhi

            axios.all(endpoints.map((endpoint) => axios.get(endpoint, {headers:{'Authorization': 'Bearer ' + getAuthToken()}}))).then((res) => {
                // if(res[0].status === 200){
                //     res[0].data.map(element => stateOptions.push({value : element, label: element}));
                // }
             })
             .catch((err) => {
                console.log(err.message);
                alert("Error in getting data");
             });
             //console.log(isTouched, (!data.providerNo||(data.providerNo&&!data.providerNo.value)), (isTouched.providerNo===true), ((!data.providerNo||(data.providerNo&&!data.providerNo.value))&&(isTouched.providerNo===true)));
             return(
                <>
                <div className="Container AddProviderLabel AddModalLabel">
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label style={{marginBottom: 3, fontSize: 'var(--font-size-small)'}}>Provider#</label>
                            <br />
                            <input maxLength="10" type="text" 
                            value={((data) && ('providerNo' in data) && (data.providerNo.value !== undefined)) ? (convertToCase(data.providerNo.value)) : (convertToCase(data.providerNo))}
                                //onBlur={()=>{ if(!isTouched.providerNo){setIsTouched({...isTouched, providerNo: true})}}}
                                onChange={(evnt)=>{handleGridFieldChange(index, evnt,FIRLTable.displayName); setIsTouched({...isTouched, providerNo: evnt.target.value})}}
                                 name="providerNo" className={`form-control ${((!data.providerNo||(data.providerNo&&!data.providerNo.value))&&(isTouched.providerNo===true))?"is-invalid":""}`} title="Please Enter Valid Provider#"
                                 disabled={lockStatus !== 'N'}/>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label style={{marginBottom: 3, fontSize: 'var(--font-size-small)'}}>Component</label>
                            <br />
                            <input maxLength="20" type="text" 
                            value={((data) && ('component' in data) && (data.component.value !== undefined)) ? (convertToCase(data.component.value)) : (convertToCase(data.component))}
                                //onBlur={()=>{ if(!isTouched.component){setIsTouched({...isTouched, component: true})}}}
                                onChange={(evnt)=>{handleGridFieldChange(index, evnt,FIRLTable.displayName); setIsTouched({...isTouched, component: evnt.target.value})}}
                                name="component" className={`form-control ${((!data.component||(data.component&&!data.component.value))&&(isTouched.component===true))?"is-invalid":""}`} title="Please Enter Valid Component"
                                disabled={lockStatus !== 'N'}/>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label style={{marginBottom: 3, fontSize: 'var(--font-size-small)'}}>Current Rate</label>
                            <br />
                            <input maxLength="20" type="text"
                             value={((data) && ('currentRate' in data) && (data.currentRate.value !== undefined)) ? (convertToCase(data.currentRate.value)) : (convertToCase(data.currentRate))}
                                //onBlur={()=>{ if(!isTouched.currentRate){setIsTouched({...isTouched, currentRate: true})}}}
                                onChange={(evnt)=>{handleGridFieldChange(index, evnt,FIRLTable.displayName); setIsTouched({...isTouched, currentRate: evnt.target.value})}}
                                id="currentRate"
                                //  placeholder="9xx-xx-xxxx" pattern="[9]{1}[0-9]{2}-[0-9]{2}-[0-9]{4}"
                                 name="currentRate" className={`form-control ${((!data.currentRate||(data.currentRate&&!data.currentRate.value))&&(isTouched.currentRate===true))?"is-invalid":""}`}
                                title="Please Enter Valid Current Rate"
                                disabled={lockStatus !== 'N'}/>
                            {/* <small>Format: 9xx-xx-xxxx</small> */}
                        </div>

                     </div>
                     <br/>
                     <div className="row">
                     <div className="col-xs-6 col-md-3">
                            <label style={{marginBottom: 3, fontSize: 'var(--font-size-small)'}}>New Rate</label>
                            <br />
                            <input maxLength="10" type="text"
                             value={((data) && ('newRate' in data) && (data.newRate.value !== undefined)) ? (convertToCase(data.newRate.value)) : (convertToCase(data.newRate))}
                                //onBlur={()=>{ if(!isTouched.newRate){setIsTouched({...isTouched, newRate: true})}}}
                                onChange={(evnt)=>{handleGridFieldChange(index, evnt,FIRLTable.displayName); setIsTouched({...isTouched, newRate: evnt.target.value})}}
                                id="newRate" name="newRate" className={`form-control ${((!data.newRate||(data.newRate&&!data.newRate.value))&&(isTouched.newRate===true))?"is-invalid":""}`}
                                title="Please Enter Valid New Rate"
                                disabled={lockStatus !== 'N'}/>
                            {/* <small>Format: xxxxxxxxxx</small> */}
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label style={{marginBottom: 3, fontSize: 'var(--font-size-small)'}}>Comment</label>
                            <br />
                            <input maxLength="100" type="text" 
                            value={((data) && ('comment' in data) && (data.comment.value !== undefined)) ? (convertToCase(data.comment.value)) : (convertToCase(data.comment))}
                                //onBlur={()=>{ if(!isTouched.comment){setIsTouched({...isTouched, comment: true})}}}
                                onChange={(evnt)=>{handleGridFieldChange(index, evnt,FIRLTable.displayName); setIsTouched({...isTouched, comment: evnt.target.value})}}
                                id="comment" name="comment" className={`form-control ${((!data.comment||(data.comment&&!data.comment.value))&&(isTouched.comment===true))?"is-invalid":""}`}
                                title="Please Enter Valid Comment"
                                disabled={lockStatus !== 'N'}/>
                            {/* <small>Format: xxxxxxxxxx</small> */}
                        </div>
                     </div>
                     <br/>



                </div>
            </>
        )
        //}
    }





    const tdData = () => {
        //console.log("Inside tdData");
        if (firlTableRowsData!==undefined && firlTableRowsData.length>0){
            //console.log("FIRLTable Data: ",firlTableRowsData);
        return firlTableRowsData.map((data, index)=>{
            //const {fullName, emailAddress, salary, specialityDefault}= data;
            return(
                <tr key={index}>
                {lockStatus=='N'
                    ?
                    <td>
                         <span
                  style={{
                    display: "flex",
                  }}
                >
                    <button className="deleteBtn" style={{float:"left"}}  onClick={()=> {deleteTableRows(index,FIRLTable.displayName,"Force Delete"); handleOperationValue("Force Delete"); decreaseDataIndex();}}>
                    <i className="fa fa-trash"></i></button>
                    <button className ="editBtn" style={{float:"right"}} type="button" onClick={() => {editTableRows(index,FIRLTable.displayName);handleModalChange(true); handleDataIndex(index); handleOperationValue("Edit")}}>
                    <i className="fa fa-edit"></i></button>
                    </span>
                    </td>
                // }
                //        {lockStatus == 'V'
                //             &&
                          :  <td>
                                <div>
                                    <button className="editBtn" style={{ float: "right" }} type="button" onClick={() => {editTableRows(index,FIRLTable.displayName);handleModalChange(true); handleDataIndex(index); handleOperationValue("Edit") }}>
                                        <i className="fa fa-eye"></i></button>
                                </div>

                            </td>
                        }
                <td>
                    {(('providerNo' in data) && (data.providerNo.value !== undefined)) ? (convertToCase(data.providerNo.value)) : (convertToCase(data.providerNo))}
                </td>
                <td>
                    {(('component' in data) && (data.component.value !== undefined)) ? (convertToCase(data.component.value)) : (convertToCase(data.component))}
                </td>
                <td>
                    {(('currentRate' in data) && (data.currentRate.value !== undefined)) ? (convertToCase(data.currentRate.value)) : (convertToCase(data.currentRate))}
                </td>
                <td>
                    {(('newRate' in data) && (data.newRate.value !== undefined)) ? (convertToCase(data.newRate.value)) : (convertToCase(data.newRate))}
                </td>
                <td>
                    {(('comment' in data) && (data.comment.value !== undefined)) ? (convertToCase(data.comment.value)) : (convertToCase(data.comment))}
                </td>
            </tr>
            )
        })
    }
    }

    const decreaseDataIndex = () => {
        if(operationValue === "Add" || operationValue==='Force Delete'){
            const indx = dataIndex - 1;
            setDataIndex(indx);
        }
    }

    const handleOperationValue = (oprtnValue) => {
        setOperationValue(oprtnValue);
    }

    const handleModalChange = (flag) => {
        // setDataIndex({
        //     ...dataIndex,
        //     ...opertnData
        // });
        //console.log("Handle Modal Change Data Index After: ",dataIndex);
        setModalShow(flag);
    }

    const handleDataIndex = (index) => {
        //console.log("Inside setDataIndex: ",index);
        setDataIndex(index);
    }

    return (
    <>
        <table className="table table-bordered tableLayout" id="FIRLTable">
            <thead>
                <tr>
                    {lockStatus=='N'
                        ?
                        <th scope="col" style={{width:"7.5%"}}><button className='addBtn' onClick={() => {addTableRows(FIRLTable.displayName);  handleModalChange(true); handleDataIndex(firlTableRowsData.length); handleOperationValue("Add");}}>
                        <i className="fa fa-plus"></i></button>
                        </th>
                    // }
                    // {lockStatus == 'V'
                    //         &&
                            :<th style={{ width: "6%" }}></th>
                        }
                    <th scope="col">Provider#</th>
                    <th scope="col">Component</th>
                    <th scope="col">Current Rate</th>
                    <th scope="col">New Rate</th>
                    <th scope="col">Comment</th>
                </tr>
            </thead>
            <tbody>
                {/* <TableRows FIRLTableRowsData={FIRLTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
                {tdData()}
            </tbody>
        </table>
        {(firlTableRowsData!==undefined && firlTableRowsData.length<=0)?<div className="invalid-feedback" style={{display:'block'}}>Atleast one entry is required if Critical Access Hospital is 'Yes'</div>:null}
        <GridModal name={"Hospital Compensation Details"} validationObject={isTouched} modalShow={modalShow} handleModalChange={handleModalChange} dataIndex={dataIndex}
        tdDataReplica = {tdDataReplica} deleteTableRows={deleteTableRows} gridName={FIRLTable.displayName}
        decreaseDataIndex={decreaseDataIndex} operationValue={operationValue} gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}></GridModal>
    </>
  )

}




