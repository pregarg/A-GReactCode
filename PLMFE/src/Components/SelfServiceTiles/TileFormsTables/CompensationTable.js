import React,{ useState } from 'react'
// import axios from 'axios';
import {useAxios} from '../../../api/axios.hook';
import Select from 'react-select';
import GridModal from './GridModal';
import { getAuthToken } from "../../../util/auth";
import { useSelector } from 'react-redux';
import useGetDBTables from '../../CustomHooks/useGetDBTables';


export default function CompensationTable({compensationTableRowsData,
    deleteTableRows, addTableRows,
    handleGridSelectChange,editTableRows,gridFieldTempState,
    handleGridFieldChange,gridRowsFinalSubmit, lockStatus}) {
        CompensationTable.displayName = "CompensationTable";
        //const [dataIndex,setDataIndex] = useState({operation:'',modalIndex:0});
        const [dataIndex,setDataIndex] = useState();
        const [operationValue,setOperationValue] = useState("");
        const [modalShow, setModalShow] = useState(false);
        const {customAxios:axios} = useAxios();
        const { getGridJson,convertToCase } = useGetDBTables();


    const [isTouched,setIsTouched] = useState({});
    const mastersSelector = useSelector((masters) => masters);
    //console.log("Masters Selector: ",mastersSelector);
    // let endpoints = [];

      let scheduleSelect =[];
      let selectJson = {};
      let specialtyOptions = [];

      if(mastersSelector.hasOwnProperty('masterCompositionMaster')){
           const compMaster = mastersSelector['masterCompositionMaster'][0];
           scheduleSelect = (compMaster.hasOwnProperty('schedule')?compMaster['schedule']:[]);
      }

      if (mastersSelector.hasOwnProperty("masterSpeciality")) {
        selectJson.specialtyOptions =
          mastersSelector["masterSpeciality"].length === 0
            ? []
            : mastersSelector["masterSpeciality"][0];
      }
      selectJson['specialtyOptions'].map(val => specialtyOptions.push({ value: val['speciality'], label: val['speciality'] }));


    // let scheduleOptions = [];
    //   const scheduleValue = useSelector(store => store.masterStateSymbol);
    //   console.log("scheduleValue :",scheduleValue);
      const tdDataReplica = (index) => {
        //if(compensationTableRowsData !==undefined && compensationTableRowsData.length>0){
            const data = getGridJson(gridFieldTempState);
            //const data = compensationTableRowsData[index];
            // scheduleValue[0].data.map(val => scheduleOptions.push({value : val, label: val})); //Added by Nidhi

            // axios.all(endpoints.map((endpoint) => axios.get(endpoint, {headers:{'Authorization': 'Bearer ' + getAuthToken()}}))).then((res) => {
            //  })
            //  .catch((err) => {
            //     console.log(err.message);
            //     alert("Error in getting data");
            //  });
             //console.log(isTouched, (!data.rate||(data.rate&&!data.rate.value)), (isTouched.rate===true), ((!data.rate||(data.rate&&!data.rate.value))&&(isTouched.rate===true)));
             return(
                <>
                <div className="Container AddProviderLabel AddModalLabel">
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Rate#</label>
                           {/* <input maxLength="5" type="number" value={(('rate' in data) && (data.rate.value !== undefined)) ? (data.rate.value) : (data.rate)}
                                onBlur={()=>{ if(!isTouched.rate){setIsTouched({...isTouched, rate: true})}}}
                                // onChange={(evnt)=>{handleGridFieldChange(index, evnt,CompensationTable.displayName); 
                                //     setIsTouched({...isTouched, rate: evnt.target.value})}}

                                onChange={(evnt) => {
                                    // Enforce 5-digit limit as with type="number", maxlength doesn't work
                                    if (evnt.target.value.length <= 5) {
                                        handleGridFieldChange(index, evnt, CompensationTable.displayName);
                                    }
                                    setIsTouched({ ...isTouched, rate: evnt.target.value });
                                }}
                                 name="rate" className={`form-control ${((!data.rate||(data.rate&&!data.rate.value))&&(isTouched.rate===true))?"is-invalid":""}`} title="Please Enter Valid Rate"
                                 disabled={lockStatus == 'V'}/>*/}


                           <input
                            maxLength="10"
                            type="text"
                            value={((data) && ('rate' in data) && (data.rate.value !== undefined)) ? (convertToCase(data.rate.value)) : (convertToCase(data.rate))}
                            onChange={(evnt)=>{handleGridFieldChange(index, evnt,CompensationTable.displayName)}}
                            name="rate"
                            className="form-control"
                            disabled={lockStatus !== 'N'}/>
                        </div>
                        <div className="col-xs-6 col-md-3">
                       <label>Schedule</label>
                       <Select
                       styles={{
                        control: (provided) => ({
                          ...provided,
                          fontWeight:'lighter'
                        }),}}
                           value={data.schedule}
                           onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, CompensationTable.displayName))}
                           options={scheduleSelect}
                           name = "schedule"
                           id = "scheduleDropDown"
                           isClearable
                           isDisabled={lockStatus !== 'N'}
                       />
                         </div>

                         <div className="col-xs-6 col-md-3">
                                <label>Specialty</label>
                                {/* <br /> */}
                                <Select
                                styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      fontWeight:'lighter'
                                    }),}}
                                    value={data.speciality}
                                    onChange={(selectValue, event) => (handleGridSelectChange(index, selectValue, event, CompensationTable.displayName))}
                                    options={specialtyOptions}
                                    name="speciality"
                                    id="specialityDropDown"
                                    isClearable
                                    isDisabled={lockStatus !== 'N'}
                                />
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
        if (compensationTableRowsData !==undefined && compensationTableRowsData.length>0){
            //console.log("FIRLTable Data: ",compensationTableRowsData);
        return compensationTableRowsData.map((data, index)=>{
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
                    <button className="deleteBtn" style={{float:"left"}}  onClick={()=> {deleteTableRows(index,CompensationTable.displayName,"Force Delete"); handleOperationValue("Force Delete"); decreaseDataIndex();}}>
                    <i className="fa fa-trash"></i></button>
                    <button className ="editBtn" style={{float:"right"}} type="button" onClick={() => {editTableRows(index,CompensationTable.displayName); handleModalChange(true); handleDataIndex(index); handleOperationValue("Edit")}}>
                    <i className="fa fa-edit"></i></button>
                    </span>
                    </td>
                    
                // }
                //  {lockStatus == 'V'
                //             &&
                          :  <td>
                                <div>
                                    <button className="editBtn" style={{ float: "right" }} type="button" onClick={() => {editTableRows(index,CompensationTable.displayName); handleModalChange(true); handleDataIndex(index); handleOperationValue("Edit") }}>
                                        <i className="fa fa-eye"></i></button>
                                </div>

                            </td>
                        }
                <td>
                    {(('rate' in data) && (data.rate.value !== undefined)) ? (convertToCase(data.rate.value)) : (convertToCase(data.rate))}
                </td>
                <td>
                    {(('schedule' in data) && (data.schedule.value !== undefined)) ? (convertToCase(data.schedule.value)) : (convertToCase(data.schedule))}
                </td>
                <td className='tableData'>
                    {(('speciality' in data) && (data.speciality.value !== undefined)) ? (convertToCase(data.speciality.value)) : (convertToCase(data.speciality))}
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
                        <th scope="col" style={{ width: "7.5%" }}><button className='addBtn' onClick={() => {addTableRows(CompensationTable.displayName);  handleModalChange(true); handleDataIndex(compensationTableRowsData.length); handleOperationValue("Add");}}>
                        <i className="fa fa-plus"></i></button>
                        </th>
                    // }
                    //   {lockStatus == 'V'
                    //         &&
                         :   <th style={{ width: "6%" }}></th>
                        }
                    <th scope="col">Rate#</th>
                    <th scope="col">Schedule</th>
                    <th scope="col">Specialty</th>
                </tr>
            </thead>
            <tbody>
                {tdData()}
            </tbody>
        </table>
        {(compensationTableRowsData!==undefined && compensationTableRowsData.length<=0)?<div className="invalid-feedback" style={{display:'block'}}></div>:null}
        
        <GridModal name={"Provider Compensation Details"} validationObject={isTouched} modalShow={modalShow} handleModalChange={handleModalChange} dataIndex={dataIndex}
        tdDataReplica = {tdDataReplica} deleteTableRows={deleteTableRows} gridName={CompensationTable.displayName}
        decreaseDataIndex={decreaseDataIndex} operationValue={operationValue} gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}></GridModal>
    </>
  )

}




