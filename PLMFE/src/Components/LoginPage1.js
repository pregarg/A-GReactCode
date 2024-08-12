import React, { useState } from 'react'
import headerLogo from '../Images/LoginPageLogo.png';
import loginPageLogo from '../Images/LoginPageFormImage.png';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const navigateHome = () => {
        console.log("Inside navigate Home");
        navigate('/Home', { replace: true });
    };
    const navigateContractingHome = () => {
        console.log("Inside navigate ContHome");
        navigate('/ContractingHome', { replace: true });
    };

    const [changeState, setChangeState] = useState({
        loginField: "",
        passwordField: ""
    });

    const handleChange = (evt) => {
        const value = evt.target.value;
        console.log("Inside handleChange ", evt);
        setChangeState({
            ...changeState,
            [evt.target.name]: value
        });
    }
    return (
        <>
            {/* <div className='container' style={{display: "flex", height: "100px",margin: "20px"}}>
                <div style={{width: "50%"}}>
                    <img id = 'headerImage' src = {headerLogo} className="img-fluid" alt="..."></img>
                </div>

                <div className = "mx-2" style={{flexGrow: "2",marginLeft: "20px"}}>
                    <label id = 'headerLabel'><b>Welcome to Provider Online Portal, a new way to serve Providers. 
                        In this portal you will be able to view current statuses, submit new requests, view 
                        and download documents and maintain existing data related to the Provider. 
                        All provider change can be completed on the Self-Service Page. 
                        If your organization is requesting to Network with us and has not done so already, 
                        please click on the “Register Me” button to start filing a Network Request form with us. 
                        If you are currently networked with us,please login.</b></label>
                </div>
        </div> */}
            <div className="loginPage" style={{ overflow: "hidden", height: (document.documentElement.clientHeight*0.94)+'px', }}>
                <div className="container">
                    <div style={{ display: 'flex', textAlign:'left', marginTop: 60 }}>
                        <div style={{ margin: '10px', alignSelf:'center'}}>
                            <img id='headerImage' src={headerLogo} alt="..."></img>
                        </div>
                        <div>
                            <label className="homeDescriptionText">
                                <p className='homeTaglineText' style={{marginBottom: 0}}>Welcome to Provider Online Portal, A New Way To Serve Providers.</p>
                                <p style={{width: '95%'}}>In this portal you can view current statuses, submit new requests, view
                                and download documents and maintain existing data related to the Providers.
                                All Provider change can be done on the Self Service Page.
                                If your organization wants to network with us and has not done so already,
                                please click on “Register” button to fill a Network Request Form with us.
                                If you are currently in network with us, please login.</p>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-6 col-md-6 loginSection">
                            <img id='loginPageImage' src={loginPageLogo} className="img-fluid" alt="..." style={{ boxShadow: 'rgb(126 142 177 / 35%) 0px 0px 3px 3px', borderRadius: 5 }}></img>
                        </div>
                        <div className="col-xs-6 col-md-6 loginSection" style={{ boxShadow: 'rgb(126 142 177 / 35%) 0px 0px 3px 3px', borderRadius: 5, backgroundColor: '#FFF'}}>
                            <label id="loginDefinition" className='PortalLoginLabel'>Portal Login</label>
                            <div className='loginFieldContainer'>
                                <label htmlFor="loginField" className="form-label">Email:</label>
                                <input className="form-control" name="loginField" placeholder="name@example.com" type="text" onChange={event => handleChange(event)} value={changeState.loginField}/>
                            </div>
                            <div className='loginFieldContainer'>
                                <label htmlFor="passwordField" className="form-label">Password:</label>
                                <input className="form-control" id="passwordField" name="passwordField" placeholder="**********" type="password" onChange={event => handleChange(event)} value={changeState.passwordField}/>
                            </div>
                            <div className='loginButtonContainer'>
                                <button className="loginPageBottomButton button" id="loginButton" onClick={navigateHome}>Login</button>
                                <button className="loginPageBottomButton button" id="cancelButton">Register</button>
                                <button className="loginPageBottomButton button" id="contractingButton" onClick={navigateContractingHome}>Contracting</button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label id="loginPageBottomLabel">Do you have trouble logging in? Please contact our customer support at <span style={{color:'var(--primary)', fontWeight: 600, textDecoration:'underline'}}>1-800-000-000</span>.
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='container' style={{display: "flex", height: "100px",margin: "20px"}}>
                <div style={{width: "70%"}}>
                    <img id = 'loginPageImage' src = {loginPageLogo} className="img-fluid" alt="..."  style={{marginLeft: "140px"}}></img>
                </div>
                <div className = "mx-2" style={{flexGrow: "2"}}>
                    <label id="loginDefinition">Portal Login</label>
                    <div>
                        <br/>
                    </div>
                    <div className = "row">
                        <div>
                            <label htmlFor="loginField" className="loginPageLabel" id="loginIdLabel">Login Id:</label> 
                            <input id="loginField" name="loginField" type="text" onChange={event => handleChange(event)} value={changeState.loginField}/>
                        </div>
                        <div>
                            <br/>
                        </div>
                        <div>
                            <label htmlFor="passwordField" className="loginPageLabel" id="passwordLabel">Password:</label> 
                            <input id="passwordField" name="passwordField" type="password" onChange={event => handleChange(event)} value={changeState.passwordField}/>
                        </div>
                        <div>
                            <br/>
                            <br/>
                        </div>
                        <div>
                            <button className="loginPageButton" id="loginButton" onClick={navigateHome}>Log In</button>
                            <button className="loginPageButton" id="cancelButton">Cancel</button>
                        </div>
                        <div>
                            <br/>
                        </div>
                        <div>
                            <button className="loginPageBottomButton" type="submit" id="signUpButton">Sign Up</button>
                            <button className="loginPageBottomButton" id="forgotPassButton">Forgot Password?</button>
                            <button className="loginPageBottomButton" id="contractingButton">Contracting</button>
                        </div>
                        <div>
                            <br/>
                            <br/>
                        </div>
                        <div>
                            <label id="loginPageBottomLabel">Do you have trouble logging in? Please contact our customer support at 1-800-000-000
                            </label>
                        </div>
                    </div>
                </div>
            </div> */}
            </div>
            <footer className="loginPageFooter" style={{ marginTop: "20px", textAlign: "center", paddingBottom: '30px' }}>
                <label></label>
            </footer>
        </>
    )
}
