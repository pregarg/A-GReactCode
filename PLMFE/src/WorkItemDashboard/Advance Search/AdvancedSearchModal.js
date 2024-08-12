import React, { useState, useEffect }  from 'react'
import useUpdateDecision from '../../Components/CustomHooks/useUpdateDecision';
import { Button, Modal } from 'react-bootstrap';
import Select, { components } from "react-select";
import { useSelector} from 'react-redux';
import useGetDBTables from '../../Components/CustomHooks/useGetDBTables';
import './AdvancedSearchModal.css'

export default function AdvancedSearchModal(prop) {
    const {printConsole} = useUpdateDecision();

    const { convertToCase } = useGetDBTables();

    const [fieldState,setFieldState] = useState({
        "StageName":'',
        "LegalEntityName":'',
        "NpiId":'',
        "CaseNumber":'',
        "FirstName":'',
        "LastName":'',
        "TransactionType":'',
        "Field2":'',
        "FlowId":''
    });

    const[selectValues,setSelectValues] = useState({});

    const mastersSelector = useSelector((masters) => masters);
    printConsole("Advanced Search master selector: ",mastersSelector);
    printConsole('Inside AdvancedSearchModal: ',prop)

    useEffect(() =>{
        let selectJson = {};
        let newstateOptions = [];
        if (mastersSelector.hasOwnProperty("masterStateSymbol")) {
            newstateOptions = [];
            let orgstateOptions =
              mastersSelector["masterStateSymbol"].length === 0
                ? []
                : mastersSelector["masterStateSymbol"][0];
            if(orgstateOptions.length>0){
                for (let i = 0; i < orgstateOptions.length; i++) {
                    newstateOptions.push({
                      label: convertToCase(orgstateOptions[i].stateSymbol),
                      value: convertToCase(orgstateOptions[i].stateSymbol),
                    });
                }

                selectJson.stateDropDown = newstateOptions;
            }
            
          }

          if(mastersSelector.hasOwnProperty("masterTypeCommon")){
            if(mastersSelector["masterTypeCommon"].length>0){
                newstateOptions = [];

                mastersSelector["masterTypeCommon"].forEach((elem) => {
                    if(elem.Type.toLowerCase() === 'transactiontype')
                    newstateOptions.push({label:convertToCase(elem.DisplayName), value:convertToCase(elem.ActualName)})
                }) 
                selectJson.transactionDropDown = newstateOptions;
            }
          }

          setTimeout(() => setSelectValues(selectJson), 1000);
    },[])
    
    const handleModalShowHide = (flag) => {
        printConsole("Inside AdvancedSearch handleModalShowHide state value: ",fieldState);
        printConsole("Inside AdvancedSearch handleModalShowHide flag value: ",flag);
        prop.setShowModal(flag);
    }

    const { ValueContainer, Placeholder } = components;
    const CustomValueContainer = ({ children, ...props }) => {
        return (
          <ValueContainer {...props}>
            <Placeholder {...props} isFocused={props.isFocused}>
              {props.selectProps.placeholder}
            </Placeholder>
            {React.Children.map(children, (child) =>
              child && child.type !== Placeholder ? child : null
            )}
          </ValueContainer>
        );
      };

    const setStateData = (evnt) => {
        const {name , value} = evnt.target;
        setFieldState({...fieldState,[name]:value});
    }

    const setSelectStateData = (selectedValue,evnt) => {
        console.log('Inside setSelectStateData with event: ',evnt);
        console.log('Inside setSelectStateData with selectedValue: ',selectedValue);
        const {name} = evnt;
        
        console.log('Inside setSelectStateData with event name value: ',name);
        const value  = (selectedValue!==null)?selectedValue.value:'';
        if(name.toLowerCase()==='flowid'){
            loadStageName(value);
        }
        console.log('Inside setSelectStateData with event selected value: ',value);
        setFieldState({...fieldState,[name]:value});
    }

    const loadStageName = (flowId) => {
        if(flowId !== ''){
            //let selectValuesReplica = {...selectValues};
            
            //console.log('Inside loadStageName masterSelector==== ',mastersSelector);
            //console.log('Inside loadStageName selectValuesReplica==== ',selectValuesReplica);
            if(mastersSelector.hasOwnProperty("masterStageTable")){
                if(mastersSelector["masterStageTable"][0].length>0){
                    let newstateOptions = [];
                    //console.log("mastersSelector['masterStageTable']====",mastersSelector["masterStageTable"][0]);
                    mastersSelector["masterStageTable"][0].forEach((elem) => {
                        if(elem.FlowId === flowId)
                        newstateOptions.push({label:convertToCase(elem.StageName), value:convertToCase(elem.StageName)})
                    }) 

                    //console.log("NewStateOptions==== ",newstateOptions);
                    //selectValuesReplica.stageDropDown = newstateOptions;
                    selectValues.stageDropDown = newstateOptions;

                    //setSelectValues(selectValuesReplica);
                }
              }
        }

        if(flowId === ''){
            if(selectValues.hasOwnProperty("stageDropDown")){
                delete selectValues['stageDropDown'];
            }

            if(fieldState.hasOwnProperty('StageName')){
                delete fieldState['StageName'];
            }
        }
    }
    const handleKeyDown = (evnt) => {
        
        //console.log("Inside handleKeyDown evnt: ",evnt);
        //console.log("Inside handleKeyDown evnt key: ",evnt.key)
        if(evnt.key === 'Enter'){
            evnt.preventDefault();
            document.getElementById("advanceSearchButton").click();
            //document.getElementById("advanceSearchCancel").click();
        }
    }


    const searchFields = () => {
        return(
            <div className="container">
             <div className="row my-2">
                
                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control uppercase-input" id="legalEntityName" placeholder="" 
                        name="LegalEntityName" onChange={(event) => setStateData(event)}
                        onKeyDown={(event) => handleKeyDown(event)}/>
                        <label htmlFor="legalEntityName">Legal Entity Name</label>
                    </div>
                </div>

                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control uppercase-input" id="npi" placeholder="" 
                        name="NpiId" onChange={(event) => setStateData(event)}
                        onKeyDown={(event) => handleKeyDown(event)}/>
                        <label htmlFor="npi">NPI ID</label>
                    </div>
                </div>

            </div>

            <div className="row my-2">

                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control uppercase-input" id="caseNumber" placeholder="" 
                        name="CaseNumber" onChange={(event) => setStateData(event)}
                        onKeyDown={(event) => handleKeyDown(event)}/>
                        <label htmlFor="caseNumber">Case Number</label>
                    </div>
                </div>

                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control uppercase-input" id="firstName" placeholder="" 
                        name="FirstName" onChange={(event) => setStateData(event)}
                        onKeyDown={(event) => handleKeyDown(event)}/>
                        <label htmlFor="firstName">First Name</label>
                    </div>
                </div>

            </div>

            <div className="row my-2">
                
                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        <input type="text" className="form-control uppercase-input" id="lastName" placeholder="" 
                        name="LastName" onChange={(event) => setStateData(event)}
                        onKeyDown={(event) => handleKeyDown(event)}/>
                        <label htmlFor="lastName">Last Name</label>
                    </div>
                </div>

                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        {/* <label htmlFor="floatingSelect">Gender</label> */}
                        {/* <label htmlFor="state">Gender</label> */}
                        <Select
                            // classNames={{
                            //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                            // }}

                            styles={{
                            control: (provided) => ({
                                ...provided,
                                height: "58px",
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                maxHeight: 200,
                            }),

                            container: (provided, state) => ({
                                ...provided,
                                marginTop: 0,
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                overflow: "visible",
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                position: "absolute",
                                top:
                                state.hasValue ||
                                state.selectProps.inputValue
                                    ? -15
                                    : "50%",
                                transition:
                                "top 0.1s, font-size 0.1s",
                                fontSize:
                                (state.hasValue ||
                                    state.selectProps.inputValue) &&
                                13,
                            }),
                            }}
                            components={{
                            ValueContainer: CustomValueContainer,
                            }}
                            isClearable
                            name="TransactionType"
                            
                            className="basic-multi-select"
                            options={selectValues.transactionDropDown}
                            id="transactionTypeDropdown"
                            isMulti={false}
                            //onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                            onChange={(selectValue,event) => {
                                setSelectStateData(selectValue,event)
                            //setFieldValue(field.name, selectValue);
                            }}
                            onKeyDown={(event) => handleKeyDown(event)}
                            //value={apiTestState.gender}
                            //value={field.value}
                            placeholder="Transaction Type"
                            //styles={{...customStyles}}
                            isSearchable={
                            document.documentElement.clientHeight >
                            document.documentElement.clientWidth
                                ? false
                                : true
                            }
                        />
                        </div>
                </div>

            </div>

            <div className="row my-2">
                
                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        {/* <label htmlFor="floatingSelect">Gender</label> */}
                        {/* <label htmlFor="state">Gender</label> */}
                        <Select
                            // classNames={{
                            //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                            // }}

                            styles={{
                            control: (provided) => ({
                                ...provided,
                                height: "58px",
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                maxHeight: 200,
                            }),

                            container: (provided, state) => ({
                                ...provided,
                                marginTop: 0,
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                overflow: "visible",
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                position: "absolute",
                                top:
                                state.hasValue ||
                                state.selectProps.inputValue
                                    ? -15
                                    : "50%",
                                transition:
                                "top 0.1s, font-size 0.1s",
                                fontSize:
                                (state.hasValue ||
                                    state.selectProps.inputValue) &&
                                13,
                            }),
                            }}
                            components={{
                            ValueContainer: CustomValueContainer,
                            }}
                            isClearable
                            name="Field2"
                            
                            className="basic-multi-select"
                            options={selectValues.stateDropDown}
                            id="stateDropdown"
                            isMulti={false}
                            //onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                            onChange={(selectValue,event) => {
                                setSelectStateData(selectValue,event)
                            //setFieldValue(field.name, selectValue);
                            }}
                            onKeyDown={(event) => handleKeyDown(event)}
                            //value={apiTestState.gender}
                            //value={field.value}
                            placeholder="State"
                            //styles={{...customStyles}}
                            isSearchable={
                            document.documentElement.clientHeight >
                            document.documentElement.clientWidth
                                ? false
                                : true
                            }
                        />
                        </div>
                </div>
                
                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        {/* <label htmlFor="floatingSelect">Gender</label> */}
                        {/* <label htmlFor="state">Gender</label> */}
                        <Select
                            // classNames={{
                            //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                            // }}

                            styles={{
                            control: (provided) => ({
                                ...provided,
                                height: "58px",
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                maxHeight: 200,
                            }),

                            container: (provided, state) => ({
                                ...provided,
                                marginTop: 0,
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                overflow: "visible",
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                position: "absolute",
                                top:
                                state.hasValue ||
                                state.selectProps.inputValue
                                    ? -15
                                    : "50%",
                                transition:
                                "top 0.1s, font-size 0.1s",
                                fontSize:
                                (state.hasValue ||
                                    state.selectProps.inputValue) &&
                                13,
                            }),
                            }}
                            components={{
                            ValueContainer: CustomValueContainer,
                            }}
                            isClearable
                            name="FlowId"
                            
                            className="basic-multi-select"
                            options={[{label:'SELFSERVICE',value:2},{label:'CONTRACTING',value:1}]}
                            id="processNameDropdown"
                            isMulti={false}
                            //onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                            onChange={(selectValue,event) => {
                                setSelectStateData(selectValue,event)
                            //setFieldValue(field.name, selectValue);
                            }}
                            onKeyDown={(event) => handleKeyDown(event)}
                            //value={apiTestState.gender}
                            //value={field.value}
                            placeholder="Process Name"
                            //styles={{...customStyles}}
                            isSearchable={
                            document.documentElement.clientHeight >
                            document.documentElement.clientWidth
                                ? false
                                : true
                            }
                        />
                        </div>
                </div>

            </div>

            <div className="row my-2">
                
                <div className="col-xs-6 col-md-6">
                    <div className="form-floating">
                        {/* <label htmlFor="floatingSelect">Gender</label> */}
                        {/* <label htmlFor="state">Gender</label> */}
                        <Select
                            // classNames={{
                            //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                            // }}

                            styles={{
                            control: (provided) => ({
                                ...provided,
                                height: "58px",
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                maxHeight: 200,
                            }),

                            container: (provided, state) => ({
                                ...provided,
                                marginTop: 0,
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                overflow: "visible",
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                position: "absolute",
                                top:
                                state.hasValue ||
                                state.selectProps.inputValue
                                    ? -15
                                    : "50%",
                                transition:
                                "top 0.1s, font-size 0.1s",
                                fontSize:
                                (state.hasValue ||
                                    state.selectProps.inputValue) &&
                                13,
                            }),
                            }}
                            components={{
                            ValueContainer: CustomValueContainer,
                            }}
                            isClearable
                            name="StageName"
                            
                            className="basic-multi-select"
                            options={selectValues.stageDropDown}
                            id="stageDropdown"
                            value={{label:fieldState.StageName,value:fieldState.StageName}}
                            isMulti={false}
                            //onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                            onChange={(selectValue,event) => {
                                setSelectStateData(selectValue,event)
                            //setFieldValue(field.name, selectValue);
                            }}
                            onKeyDown={(event) => handleKeyDown(event)}
                            //value={apiTestState.gender}
                            //value={field.value}
                            placeholder="Stage Name"
                            //styles={{...customStyles}}
                            isDisabled={(selectValues.hasOwnProperty('stageDropDown'))?false:true}
                            isSearchable={
                            document.documentElement.clientHeight >
                            document.documentElement.clientWidth
                                ? false
                                : true
                            }
                        />
                        </div>
                </div>
            </div>

        </div>
        )
    }
    return (
        <>  
            <Modal
                show={prop.showModal}
                onHide={()=>{handleModalShowHide(false);}}
                backdrop="static"
                keyboard={false}
                dialogClassName="modal-dialog"
                size="lg"
                aria-labelledby="example-custom-modal-styling-title"
                centered
            >
            <Modal.Header>
              <Modal.Title></Modal.Title>
              <Button className='btn btn-outline-primary btnStyle' id='advanceSearchCancel'
                style={{float:"right", marginLeft: "650px"}} onClick={()=>{handleModalShowHide(false);}}>
                Close</Button>
            </Modal.Header>
            <Modal.Body>
              {searchFields()}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-success" id="advanceSearchButton" onClick={()=>{handleModalShowHide(false); prop.setTableRows(fieldState)}}>Search</button>
            </Modal.Footer>
            </Modal>
            
        </>
    )
};