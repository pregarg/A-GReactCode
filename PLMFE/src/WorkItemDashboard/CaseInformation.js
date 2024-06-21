import React from 'react'
import { useLocation } from 'react-router-dom'
import './CaseInformation.css'

export default function CaseInformation(props) {
    const prop = useLocation();
    console.log("pravstatus",prop)
  return (
    <>
        <div className='CaseInformation'>
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <span className="heading">Case Number:</span>
                    <br/>
                    <span className="heading">{(prop.state.caseNumber!==undefined)?prop.state.caseNumber:''}</span>
                </div>
                <div className="col-md-3">
                    <span className="heading">Transaction Type:</span>
                    <br/>
                    <span className="heading">{(prop.state.formNames!==undefined)?prop.state.formNames:''}</span>
                </div>
                <div className="col-md-3">
                    <span className="heading">Case Status:</span>
                    <br/>
                    <span className="heading">{(prop.state.stageName!==undefined)?prop.state.stageName:''}</span>
                </div>

                <div className="col-md-3">
                    <span className="heading">Case View:</span>
                    <br/>
                    <p>{console.log.lockStatus}</p>
                    <span className="heading">{(prop.state.lockStatus!==undefined && prop.state.lockStatus === 'Y')?'Read Only':'Editable'}</span>
                </div>
            </div>
        </div>
        </div>
    </>
  )
}
