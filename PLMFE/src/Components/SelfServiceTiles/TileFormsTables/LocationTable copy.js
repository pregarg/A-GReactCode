import React,{ useState, useRef } from 'react'
import axios from 'axios';
import Select from 'react-select';
import GridModal from './GridModal';
import { Button } from 'react-bootstrap'
import ValidateAddressModal from '../TileFormModals/ValidateAddressModal';
import useGetDBTables from '../../CustomHooks/useGetDBTables';
import { useSelector } from 'react-redux';

export default function LocationTable({locationTableRowsData,deleteTableRows, handleGridSelectChange, addTableRows,
    handleGridFieldChange, modifyValidatedAddressRow, calledFormName, gridRowsFinalSubmit, selectJson}) {
        LocationTable.displayName = "LocationTable";

        //let apiUrl = 'http://localhost:8081/api/';

        const [dataIndex,setDataIndex] = useState();

        const [isTouched,setIsTouched] = useState({});

        const [operationValue,setOperationValue] = useState("");

        const [modalShow, setModalShow] = useState(false);
        const token = useSelector((state) => state.auth.token);

        const [validateAddressModal, setValidateAddressModalShow] = useState(false);

        const [locationSelection, setLocationSelection]=useState();

        const apiUrl = 'http://localhost:8081/api';
        const {getGridJson} = useGetDBTables();

        let oldAdd = useRef({});

        let validatedAdd = useRef({});

        let stateOptions = [];

        const electronicHealthOptions = [
            { value: 'Y', label: 'Yes' },
            { value: 'N', label: 'No' }
        ];

        const publicTransportationOptions = [
            { value: 'Y', label: 'Yes' },
            { value: 'N', label: 'No' }
        ];

        const handicapAccessOptions = [
            { value: 'Y', label: 'Yes' },
            { value: 'N', label: 'No' }
        ];


        // const placeInDirectoryOptions = [
        //     { value: 'Y', label: 'Yes' },
        //     { value: 'N', label: 'No' }
        // ];
        const addressTypeOptions = [
            { value: 'Type P', label: 'Type P' },
            { value: 'Type Q', label: 'Type Q' }
        ];
        const tddHearingOptions = [
            { value: 'Y', label: 'Yes' },
            { value: 'N', label: 'No' }
        ];

        let languagesOptions = [];

        let hourOptions = [];

        // let endpoints = [
        //     apiUrl+'/master/languages',
        //     apiUrl+'/master/stateSymbol',
        //     apiUrl+'/master/gridHours'
        //   ];

        const handleValidateAddressModalChange = (flag) => {
            setValidateAddressModalShow(flag);
        }

        const validateAddress = (index,flag) => {
            let locationState = locationTableRowsData;
            let oldAddress = locationTableRowsData[index];
            oldAdd.current = oldAddress;
            console.log("oldAddress: ",oldAddress);
            if((!('address1' in oldAddress) ||  oldAddress['address1'].value === '') ||
            (!('city' in oldAddress) ||  oldAddress['city'].value === '') ||
            (!('stateValue' in oldAddress) ||  oldAddress['stateValue'].value === '') ||
            (!('zipCode' in oldAddress) ||  oldAddress['zipCode'].value === '')){
                alert("Enter address details");
            }

            else{
                let validateAddressDetails = {};
                validateAddressDetails.address1 = oldAddress['address1'].value;
                validateAddressDetails.city = oldAddress['city'].value;
                validateAddressDetails.state = oldAddress['stateValue'].value;
                validateAddressDetails.zipCode = oldAddress['zipCode'].value;
                if((!('address2' in oldAddress))){
                    validateAddressDetails.address2 = '';
                }
                else{
                    validateAddressDetails.address2 = oldAddress['address2'].value;
                }
                const validateApiUrl = apiUrl + "/master/validateAddress";
            //     let validateAddressDetails2 = {};
            //     validateAddressDetails2.address1 ='4201 w rochelle ave';
            //     validateAddressDetails2.city = 'las vegas';
            //     validateAddressDetails2.state = 'nv';
            //     validateAddressDetails2.zipCode = '89103';
                axios.post(validateApiUrl,validateAddressDetails,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
                    console.log("all workItems: ",res.data);
                    if(res.status === 200){
                        if(res.data["address1"] === null || res.data["city"] === null){
                            alert("Address can not be validated. Please enter correct address details.");
                        }
                        else{
                            validateAddressDetails.address1 = res.data['address1'];
                            validateAddressDetails.city = res.data['city'];
                            validateAddressDetails.state = res.data['state'];
                            validateAddressDetails.zipCode = res.data['zipCode'];
                           // validateAddressDetails.address2 = res.data['address2'];
                            //locationState[index] = validateAddressDetails;
                            console.log("newValidatedAddress locationState: ",validateAddressDetails);
                            validatedAdd.current = validateAddressDetails;
                            setValidateAddressModalShow(flag);
                            //modifyValidatedAddressRow(index,validateAddressDetails);
                        }
                    }
                });
                console.log("newValidatedAddress: ",validateAddressDetails);

            }
        }

        const callModifyValidatedAddressRow = (index,flag) =>{
            console.log("Inside callModifyValidatedAddressRow flag: ",flag);
            console.log("Inside callModifyValidatedAddressRow: ",validatedAdd.current);
            if(locationSelection == 'new'){
            modifyValidatedAddressRow(index, validatedAdd.current);
            }else{
                const oldAdd = {...locationTableRowsData[index]};
                console.log("thid------>"+oldAdd);
                const mappedoldAdd = {};
                Object.keys(oldAdd).forEach(key => {
                    mappedoldAdd[key] = oldAdd[key].value;
                })
                modifyValidatedAddressRow(index, mappedoldAdd);
            }
            
            setValidateAddressModalShow(flag);
        }

        const validateAddressData = () =>{
            const oldAd = oldAdd.current;
            const newAdd = validatedAdd.current;
            console.log("Inside validateAddressData oldAddress: ",oldAdd.current);
            console.log("Inside validateAddressData newAddress: ",validatedAdd.current);
            return (
                <>
                    <table className="table table-striped table-bordered dashboardTableBorder ">
                        <thead>
                        <tr className='dashboardTableHeader'>
                            <th></th>
                            <th scope="col">Address 1</th>
                            <th scope="col">Address 2</th>
                            <th scope="col">City</th>
                            <th scope="col">State</th>
                            <th scope="col">Zip Code</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" className='form-check-input' onChange={()=>{setLocationSelection('old')}} checked={locationSelection == 'old'}/></td>
                                <td className='tableData'>
                                {oldAd.address1.value}
                                </td>
                                <td className='tableData'>
                                {('address2' in oldAd)? oldAd.address2.value : ''}
                                </td>
                                <td className='tableData'>
                                {oldAd.city.value}
                                </td>
                                <td className='tableData'>
                                {(('stateValue' in oldAd) && (oldAd.stateValue.value !== undefined)) ? (oldAd.stateValue.value) : (oldAd.stateValue)}
                                </td>
                                <td className='tableData'>
                                {oldAd.zipCode.value}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <br/>

                    <table className="table table-striped table-bordered dashboardTableBorder ">
                        <thead>
                        <tr className='dashboardTableHeader'>
                            <th></th>
                            <th scope="col">Address 1</th>
                            <th scope="col">Address 2</th>
                            <th scope="col">City</th>
                            <th scope="col">State</th>
                            <th scope="col">Zip Code</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" className='form-check-input' onChange={()=>{setLocationSelection('new')}} checked={locationSelection == 'new'}/></td>
                                <td className='tableData'>
                                {newAdd.address1}
                                </td>
                                <td className='tableData'>
                                {newAdd.address2}
                                </td>
                                <td className='tableData'>
                                {newAdd.city}
                                </td>
                                <td className='tableData'>
                                {newAdd.state}
                                </td>
                                <td className='tableData'>
                                {newAdd.zipCode}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )
        }

        const tdDataReplica = (index) => {
            if(locationTableRowsData.length>0){
                const data = getGridJson(locationTableRowsData[index]);
                console.log("Location Data: ",data);

                selectJson['languageArray'].map(val => languagesOptions.push({value : val, label: val}));
                selectJson['stateOptions'].map(val => stateOptions.push({value : val, label: val}));




                // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
                //     if(res[0].status === 200){
                //         res[0].data.map(element => languagesOptions.push({value : element, label: element}));
                //     }
                //     if(res[1].status === 200){
                //         res[1].data.map(element => stateOptions.push({value : element, label: element}));
                //     }
                //     if(res[2].status === 200){
                //         res[2].data.map(element => hourOptions.push({value : element, label: element}));
                //     }
                //  })
                //  .catch((err) => {
                //     console.log(err.message);
                //     alert("Error in getting data");
                //  });

                 return (
                    <>
  <div className = "container AddProviderLabel AddModalLabel">

{/* <div className = "container bg-light border border-5 rounded border border-primary"> */}
    {/* <br/> */}
                <div className = "row">

                   <div className="col-xs-6 col-md-3">
                   <label>Location Name</label>

                       <input type="text" value={(('locationName' in data) && (data.locationName.value !== undefined)) ? (data.locationName.value) : (data.locationName)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="locationName" className="form-control"/>
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>Languages Spoken</label>

                   <Select
                       value={data.languages}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={languagesOptions}
                       name = "languages"
                       id = "languagesDropDown"
                   />
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>NPI</label>

                   <input type="text" value={(('npi' in data) && (data.npi.value !== undefined)) ? (data.npi.value) : (data.npi)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="npi" className="form-control"/>
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>AddressType</label>

                   <Select
                       value={data.addressType}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={addressTypeOptions}
                       name = "addressType"
                       id = "addressTypeDropDown"
                   />
                   </div>


                    {/* <div className="col-xs-6 col-md-3">
                   <label>Place In Directory</label>

                   <Select
                       value={data.placeInDirectory}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={placeInDirectoryOptions}
                       name = "placeInDirectory"
                       id = "placeInDirectoryDropDown"
                   />
                   </div> */}

            </div>
            <br/>
            <div className = "row">
                  <div className="col-xs-6 col-md-6">
                   <label>Address 1</label>

                       <input type="text" value={(('address1' in data) && (data.address1.value !== undefined)) ? (data.address1.value) : (data.address1)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="address1" className="form-control"/>
                   </div>
                   <div className="col-xs-6 col-md-6">
                   <label>Address 2</label>

                       <input type="text" value={(('address2' in data) && (data.address2.value !== undefined)) ? (data.address2.value) : (data.address2)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="address2" className="form-control"/>
                   </div>
            </div>
            <br/>
            <div className = "row">
                 <div className="col-xs-6 col-md-3">
                   <label>City</label>

                       <input type="text" value={(('city' in data) && (data.city.value !== undefined)) ? (data.city.value) : (data.city)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="city" className="form-control"/>
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>State</label>

                       <Select
                           value={data.stateValue}
                           onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                           options={stateOptions}
                           name = "stateValue"
                           id = "stateValueDropDown"
                       />
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>Zip Code</label>

                       <input type="text" value={(('zipCode' in data) && (data.zipCode.value !== undefined)) ? (data.zipCode.value) : (data.zipCode)}  onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="zipCode" className="form-control"/>
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>Electronic Health Record</label>

                       <Select
                           value={data.electronicHealthRecord}
                           onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                           options={electronicHealthOptions}
                           name = "electronicHealthRecord"
                           id = "electronicHealthRecordDropDown"
                       />
                   </div>
            </div>
            <br/>
            <div className = "row">
                   <div className="col-xs-6 col-md-3">
                   <label>Office Phone Number</label>
                   <br />
                   <input type="text" value={(('officePhoneNumber' in data) && (data.officePhoneNumber.value !== undefined)) ? (data.officePhoneNumber.value) : (data.officePhoneNumber)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="officePhoneNumber" className="form-control"/>
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>Office Fax Number</label>
                   <br />
                   <input type="text" value={(('officeFaxNumber' in data) && (data.officeFaxNumber.value !== undefined)) ? (data.officeFaxNumber.value) : (data.officeFaxNumber)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="officeFaxNumber" className="form-control"/>
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>Public Transportation</label>
                   <br />
                   <Select
                       value={data.publicTransportation}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={publicTransportationOptions}
                       name = "publicTransportation"
                       id = "publicTransportationDropDown"
                   />
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>Handicap Access</label>
                   <br />
                   <Select
                       value={data.handicapAccess}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={handicapAccessOptions}
                       name = "handicapAccess"
                       id = "handicapAccessDropDown"
                   />
                   </div>
                </div>
                <br/>
                <div className = "row">
                   <div className="col-xs-6 col-md-3">
                   <label>TDD Hearing</label>
                   <br />
                   <Select
                       value={data.tddHearing}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={tddHearingOptions}
                       name = "tddHearing"
                       id = "tddHearingDropDown"
                   />
                   </div>

                   <div className="col-xs-6 col-md-3">
                   <label>TDD Phone</label>
                   <br />
                   <input type="text" value={(('tddPhone' in data) && (data.tddPhone.value !== undefined)) ? (data.tddPhone.value) : (data.tddPhone)} onChange={(evnt)=>(handleGridFieldChange(index, evnt,LocationTable.displayName))} name="tddPhone" className="form-control"/>
                   </div>
                </div>


<br/>

               {/* <br/>
            </div>
            <br/> */}
            <div className="col-xs-6 col-md-3">
            {(calledFormName === 'shouldValidate') &&
            <Button className='btn btn-outline-primary btnStyle'  onClick={() => {validateAddress(index,true);}}>
            Validate Address</Button>}
            </div>
           {/* <br/>
            <br/>
             <div className = "container bg-light border border-5 rounded border border-primary">
               <br/>
               <div className = "row">
                   <div className="col-xs-6 col-md-3">
                   <label>Monday From</label>

                   <Select
                       value={data.mondayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "mondayFrom"
                       id = "mondayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Monday To</label>

                   <Select
                       value={data.mondayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "mondayTo"
                       id = "mondayToDropDown"
                   />
                   </div>
                    <div className="col-xs-6 col-md-3">
                   <label>Tuesday From</label>

                   <Select
                       value={data.tuesdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "tuesdayFrom"
                       id = "tuesdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Tuesday To</label>

                   <Select
                       value={data.tuesdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "tuesdayTo"
                       id = "tuesdayToDropDown"
                   />
                   </div>
               </div>
               <br/>

               <div className = "row">


                   <div className="col-xs-6 col-md-3">
                   <label>Wednesday From</label>

                   <Select
                       value={data.wednesdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "wednesdayFrom"
                       id = "wednesdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Wednesday To</label>

                   <Select
                       value={data.wednesdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "wednesdayTo"
                       id = "wednesdayToDropDown"
                   />
                   </div>
                     <div className="col-xs-6 col-md-3">
                   <label>Thursday From</label>

                   <Select
                       value={data.thursdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "thursdayFrom"
                       id = "thursdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Thursday To</label>

                   <Select
                       value={data.thursdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "thursdayTo"
                       id = "thursdayToDropDown"
                   />
                   </div>
               </div>
               <br/>

               <div className = "row">

                   <div className="col-xs-6 col-md-3">
                   <label>Friday From</label>

                   <Select
                       value={data.fridayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "fridayFrom"
                       id = "fridayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Friday To</label>

                   <Select
                       value={data.fridayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "fridayTo"
                       id = "fridayToDropDown"
                   />
                   </div>
                     <div className="col-xs-6 col-md-3">
                   <label>Saturday From</label>

                   <Select
                       value={data.saturdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "saturdayFrom"
                       id = "saturdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Saturday To</label>

                   <Select
                       value={data.saturdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "saturdayTo"
                       id = "saturdayToDropDown"
                   />
                   </div>
               </div>
               <br/>

               <div className = "row">

                   <div className="col-xs-6 col-md-3">
                   <label>Sunday From</label>
                   <br />
                   <Select
                       value={data.sundayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "sundayFrom"
                       id = "sundayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Sunday To</label>

                   <Select
                       value={data.sundayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "sundayTo"
                       id = "sundayToDropDown"
                   />
                   </div>
               </div>
           <br/>
          </div> */}
      </div>
                </>
                 )
            }
        }

        const tdData = () => {
            // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
            //     if(res[0].status === 200){
            //         res[0].data.map(element => languagesOptions.push({value : element, label: element}));
            //     }
            //     if(res[1].status === 200){
            //         res[1].data.map(element => stateOptions.push({value : element, label: element}));
            //     }
            //     if(res[2].status === 200){
            //         res[2].data.map(element => hourOptions.push({value : element, label: element}));
            //     }
            //  })
            //  .catch((err) => {
            //     console.log(err.message);
            //     alert("Error in getting data");
            //  });
            //console.log('Inside tdData specialityArray',specialityArray);
            if(locationTableRowsData.length>0){
            return locationTableRowsData.map((data, index)=>{
                //const {fullName, emailAddress, salary, specialityDefault}= data;
                return(
                    <tr key={index}>
                    <td>
                    <span
                  style={{
                    display: "flex",
                  }}
                >
                        <button className="deleteBtn" style={{float:"left"}} onClick={()=> {deleteTableRows(index,LocationTable.displayName,operationValue); handleOperationValue("Force Delete"); decreaseDataIndex();}}>
                        <i className="fa fa-trash"></i></button>
                        <button className ="editBtn" style={{float:"right"}} type="button" onClick={() => {handleModalChange(true); handleDataIndex(index); handleOperationValue("Edit")}}>
                        <i className="fa fa-edit"></i></button>
                        </span>
                    </td>
                    <td className='tableData'>
                        {(('locationName' in data) && (data.locationName.value !== undefined)) ? (data.locationName.value) : (data.locationName)}
                    </td>
                    <td className='tableData'>
                        {(('address1' in data) && (data.address1.value !== undefined)) ? (data.address1.value) : (data.address1)}
                    </td>
                    <td className='tableData'>
                        {(('address2' in data) && (data.address2.value !== undefined)) ? (data.address2.value) : (data.address2)}
                    </td>
                    <td className='tableData'>
                        {(('city' in data) && (data.city.value !== undefined)) ? (data.city.value) : (data.city)}
                    </td>
                    <td className='tableData'>
                        {(('stateValue' in data) && (data.stateValue.value !== undefined)) ? (data.stateValue.value) : (data.stateValue)}
                    </td>
                    <td className='tableData'>
                        {(('zipCode' in data) && (data.zipCode.value !== undefined)) ? (data.zipCode.value) : (data.zipCode)}
                    </td>
                    {/* <td className='tableData'>
                        {(('tddHearing' in data) && (data.tddHearing.value !== undefined)) ? (data.tddHearing.label) : (data.tddHearing)}
                    </td>
                    <td className='tableData'>
                        {(('tddPhone' in data) && (data.tddPhone.value !== undefined)) ? (data.tddPhone.value) : (data.tddPhone)}
                    </td> */}
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
            <table className="table table-bordered tableLayout" id="LocationTable">
                <thead>
                    <tr className='tableRowStyle tableHeaderColor'>
                        <th style={{width:"7%"}}><button className='addBtn' onClick={() => {addTableRows(LocationTable.displayName); handleModalChange(true); handleDataIndex(locationTableRowsData.length); handleOperationValue("Add")}}>
                        <i className="fa fa-plus"></i></button></th>
                        <th scope="col">Location Name</th>
                        <th scope="col">Address 1</th>
                        <th scope="col">Address 2</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        <th scope="col">Zip Code</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <TableRows LocationTableRowsData={LocationTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
                    {tdData()}
                </tbody>
            </table>

            <GridModal name={"Location Information"} validationObject={isTouched} modalShow={modalShow} handleModalChange={handleModalChange} dataIndex={dataIndex}
            tdDataReplica = {tdDataReplica} deleteTableRows={deleteTableRows} gridName={LocationTable.displayName} handleValidateAddressModalChange={validateAddressModal}
            decreaseDataIndex={decreaseDataIndex} operationValue={operationValue} gridRowsFinalSubmit={gridRowsFinalSubmit}></GridModal>

            <ValidateAddressModal validateAddressModal={validateAddressModal}
            handleValidateAddressModalChange={handleValidateAddressModalChange} dataIndex={dataIndex}
            validateAddressData={validateAddressData} callModifyValidatedAddressRow={callModifyValidatedAddressRow}
            validAddress={validatedAdd.current}>
            </ValidateAddressModal>
        </>
      )
}
