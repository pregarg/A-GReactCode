import React, {useState} from "react";

import DatamanagementModal from "./DatamanagementModal"

const tableRowsData = [
    {
        col1: 'col1 Data',
        col2: 'col2 Data',
        col3: 'col3 Data'
    }
]

export default function Datamanagement(){

    const [modalShow, setModalShow]= useState(false);

    const tdData = () => {
        if(tableRowsData.length>0){
        return tableRowsData.map((data, index)=>{
            return(
                <tr key={data.userId} style={{backgroundColor: "white"}}>
                <td>
                    
                    <button 
                        className="deleteBtn" 
                        style={{float:"left"}} 
                        onClick={()=> {}}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                    
                    <button 
                        className ="editBtn" 
                        style={{float:"right"}} 
                        type="button" 
                        onClick={()=>{setModalShow(true)}}
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                </td>
                <td className='tableData'>
                    {data.col1}
                </td>
                <td className='tableData'>
                    {data.col2}
                </td>
                <td className='tableData'>
                    {data.col3}
                </td>
                </tr>
                )
            })
        }
    }

    const handleModalChange = (value)=>{
        setModalShow(value);
    }
    return(
        <div className='accordion mt-2'>
                <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                    <button 
                        className="accordion-button accordionButtonStyle" 
                        type="button" 
                        aria-expanded="true" 
                        aria-controls="panelsStayOpen-collapseOne"
                    >
                        Create / Delete Table
                    </button>
                </h2>
                <div 
                    id="panelsStayOpen-collapseOne" 
                    className="accordion-collapse collapse show" 
                    aria-labelledby="panelsStayOpen-headingOne"
                >
                    <div className="accordion-body">
                        <div className="row">
                            <div className="col-xs-6 col-md-12">
                            <table className="table table-bordered tableLayout"  id="specialityTable">
                                <thead>
                                    <tr className='tableRowStyle tableHeaderColor '>
                                        <th style={{width:"6%"}}>
                                            {/*<button className='addBtn' onClick={() => {addTableRows(SpecialityTable.displayName); handleModalChange(true); handleDataId(specialityTableRowsData.length); handleOperationValue("Add");}} >
                                        <i className="fa fa-plus"></i>
                                        </button>*/}
                                        </th>
                                        <th scope="col">Column 1</th>
                                        <th scope="col">Column 2</th>
                                        <th scope="col">Column 3</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
                                    {tdData()}
                                </tbody> 
                            </table>
                            <DatamanagementModal
                                 modalShow={modalShow}
                                 handleModalChange={handleModalChange}
                            />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}