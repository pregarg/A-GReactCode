import React from 'react'
import { useLocation } from 'react-router-dom'
import './CaseInformation.css'

export default function CaseInformation(props) {
    const prop = useLocation();
    console.log("pravstatus", prop)
    return (
        <>
            <div className='CaseInformation'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3" >
                            <span className="heading" style={{ fontSize: 20 }}>Case Number: </span>
                            <span className="heading" style={{ fontSize: 20 }}>{(prop.state.caseNumber !== undefined) ? prop.state.caseNumber : ''}</span>
                        </div>
                        <div className="col-md-3">
                            <span className="heading" style={{ fontSize: 20 }}>Transaction Type: </span>
                            <span className="heading" style={{ fontSize: 20 }}>{(prop.state.formNames !== undefined) ? prop.state.formNames : ''}</span>
                        </div>
                        <div className="col-md-3">
                            <span className="heading" style={{ fontSize: 20 }}>Case Status: </span>
                            <span className="heading" style={{ fontSize: 20 }}>{(prop.state.stageName !== undefined) ? prop.state.stageName : ''}</span>
                        </div>

                        <div className="col-md-3">
                            <span className="heading" style={{ fontSize: 20 }}>Case View: </span>
                            <span className="heading" style={{ fontSize: 20 }}>{(prop.state.lockStatus !== undefined && prop.state.lockStatus === 'Y') ? 'Read Only' : 'Editable'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
