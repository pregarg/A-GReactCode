import React from "react";
import './Banner.css';


const Banner = () => {
        return (
            <div className="health-plan">
                <header className="header">
                    <h1>ABC Healthplan</h1>
                </header>
                <div className="content">
                    <div className="row">
                        <label>Case ID</label>
                        <span>AP-0000046800</span>
                    </div>
                    <div className="row">
                        <label>Case Owner</label>
                        <span>ashish</span>
                    </div>
                    <div className="row">
                        <label>Case Status</label>
                        <span>PendingResearch</span>
                    </div>
                    <div className="row">
                        <label>True Case Due Date</label>
                        <span>06/08/2024 18:33:20</span>
                    </div>
                    <div className="row">
                        <label>Case Validation</label>
                        <span>Invalid</span>
                    </div>
                    {alert && (
                        <div className="alert">
                            <span>**Warning: Non-production/Dev Environment**</span>
                        </div>
                    )}
                </div>
                <div className="actions">
                    <button>Duplicate Check</button>
                </div>
            </div>
        );
    };
export default Banner;
