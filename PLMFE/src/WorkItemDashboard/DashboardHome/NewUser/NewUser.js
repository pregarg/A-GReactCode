import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseURL } from '../../../api/baseURL';

const initialState = {
    firstname : {
        value : '',
        isInvalid : false,
        required : true
    },
    lastname : {
        value : '',
        isInvalid: false,
        required : true
    },
    username : {
        value : '',
        isInvalid : false,
        required : true
    },
    password : {
        value : '',
        isInvalid : false,
        required : true
    },
    usertype : { 
        value : '',
        isInvalid : false,
        required : true
    },
    mailid : {
        value : '',
        isInvalid : false,
        required : true,
        validEmail : true
    },
    comment : {
        value : '',
        isInvalid : false,
        required : true
    }
}

export default function NewUser (){

    const [isEmailPatternInvalid,setIsEmailPatternInvalid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [alertState, setAlertState] = useState('');
    const [isUserNameInvalid, setIsUserNameInvalid] = useState(false); 
    
    const [formData, setFormData] = useState(initialState);
    const token = useSelector((state) => state.auth.token);

    const updateFormData = (value, field)=>{
        if(field == 'username'){
            setIsUserNameInvalid(false)
        }
        setFormData((prevState)=>{
            return {
                ...prevState, 
                [field]: {
                    ...prevState[field],
                    value: value,
                    isInvalid: false
                }
            }
        })
    }

    const newUserSubmitHandler = (e) =>{
        e.preventDefault();
        console.log('working');
        let formValidState = true;
        const keys = Object.keys(formData);
        for(let i=0; i < keys.length; i++){
            if(formData[keys[i]].required){
                if(!formData[keys[i]].value || formData[keys[i]].value.trim().length == 0){
                    formValidState = false;
                    setFormData(prevState => {
                        return {
                            ...prevState,
                            [keys[i]] : {
                                ...prevState[keys[i]],
                                isInvalid: true
                            }
                        }
                    });
                    continue;
                }else if(formData[keys[i]].validEmail && !formData[keys[i]].value.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/)){
                    formValidState = false;
                    setFormData(prevState => {
                        return {
                            ...prevState,
                            [keys[i]] : {
                                ...prevState[keys[i]],
                                isInvalid: true
                            }
                        }
                    });
                }
            }
        }
        if(formValidState){
            setIsFormValid(true);
        }
    }

    useEffect(()=>{
        if(isFormValid){
            const newUserData = {
                    firstName : formData.firstname.value,
                    lastName : formData.lastname.value,
                    password : formData.password.value,
                    userName : formData.username.value,
                    userType : formData.usertype.value,
                    mailId : formData.mailid.value,
                    comment : formData.comment.value
                }
        
                axios.post(baseURL+'/saveUserManagement', newUserData,{headers:{'Authorization':`Bearer ${token}`}}).then(res => {
                    if(res.data == 'duplicate'){
                        setIsFormValid(false);
                        setAlertState('failed');
                        setIsUserNameInvalid(true);
                        setTimeout(()=>{setAlertState('')}, 2500);
                    }else{
                        setFormData(initialState);
                    setIsFormValid(false);
                    setAlertState('success');
                   
                    setTimeout(()=>{setAlertState('')}, 2500);
                    }
                    
                }).catch(err => {
                    console.log(JSON.stringify(err));
                    alert(JSON.stringify(err));
                    setIsFormValid(false);
                    setAlertState('failed');
                    if(err.reponse.data == 'User Name already exists'){
                        alert("err");
                        setIsUserNameInvalid(true);
                    }
                    
                    setTimeout(()=>{setAlertState('')}, 2500);
                });
        }
    },[isFormValid])



    return (
        <div className="col-xs-12 mt-3" style={{minHeight: 350, padding: 15}}>
            <div className="accordion AddProviderLabel" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="panelsStayOpen-Provider">
                        <button className="accordion-button accordionButtonStyle" type="button" data-bs-target="#panelsStayOpen-collapseProvider" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                            Create New User
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseProvider" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-Provider">
                        <div className="accordion-body">
                            <div className="row">
                                {alertState == 'failed' && <div className='alert alert-danger'>Error in creating user</div> }
                                {alertState == 'success' && <div className='alert alert-success'>User has been created successfully</div> }
                            </div>
                            <form onSubmit={newUserSubmitHandler} noValidate>
                                <div className="row my-2">
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className={formData.firstname.isInvalid?'form-control is-invalid':'form-control'} id="firstname" placeholder="firstnmae" value={formData.firstname.value} name="firstname" maxLength="100" onChange={(e)=>updateFormData(e.target.value, 'firstname')}/>
                                            <label htmlFor="floatingInputGrid">First Name</label>
                                            {formData.firstname.isInvalid && <div className="small text-danger">First Name is required</div>}
                                        </div>
                                    </div>
                                
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className={formData.lastname.isInvalid?'form-control is-invalid':'form-control'} id="lastname" placeholder="lastname" value={formData.lastname.value} name="lastname"  maxLength="100" onChange={(e)=>updateFormData(e.target.value, 'lastname')}/>
                                            <label htmlFor="floatingInputGrid">Last Name</label>
                                            {formData.lastname.isInvalid && <div className="small text-danger">Last Name is required</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row my-2">
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className={formData.username.isInvalid?'form-control is-invalid':'form-control'} id="username" placeholder="username" value={formData.username.value} name="username" onChange={(e)=>updateFormData(e.target.value, 'username')} maxLength="10"></input>
                                            <label htmlFor="floatingInputGrid">User Name</label>
                                            {formData.username.isInvalid && <div className="small text-danger">User Name is required</div>}
                                            {isUserNameInvalid && <div className="small text-danger">User Name already exists</div>}
                                        </div>
                                    </div>
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating">
                                            <input type="password" className={formData.password.isInvalid?'form-control is-invalid':'form-control'} id="password" placeholder="password" value={formData.password.value} name="password" onChange={(e)=>updateFormData(e.target.value, 'password')} maxLength="10"></input>
                                            <label htmlFor="floatingInputGrid">Password</label>
                                            {formData.password.isInvalid && <div className="small text-danger">Password is required</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className = "row my-2">
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className={formData.mailid.isInvalid?'form-control is-invalid':'form-control'} id="mailid" placeholder="mailid" value={formData.mailid.value} name="mailid" onChange={(e)=>updateFormData(e.target.value, 'mailid')} maxLength="50"></input>
                                            <label htmlFor="floatingInputGrid">Email</label>
                                            {formData.mailid.isInvalid && <div className="small text-danger">Valid Email is required</div>}
                                        </div>
                                    </div>                            
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating"> 
                                            <select className={formData.usertype.isInvalid?'form-select is-invalid':'form-select'} id="usertype" value={formData.usertype.value} aria-label="Floating label select example"   onChange={(e)=>updateFormData(e.target.value, 'usertype')} name="usertype" >
                                                <option value="">Select</option>
                                                <option value="A">Admin User</option>
                                                <option value="N">Normal User</option>
                                                <option value="P">Portal User</option>
                                            </select>
                                            <label htmlFor="floatingSelect">User Type</label>
                                            {formData.usertype.isInvalid && <div className="small text-danger">User Type is required</div>}
                                        </div>            
                                    </div>
                                </div>	
                                <div className = "row my-2">
                                    <div className="col-xs-6 col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className={formData.comment.isInvalid?'form-control is-invalid':'form-control'} id="comment" placeholder="comment"   value={formData.comment.value} name="comment" onChange={(e)=>updateFormData(e.target.value, 'comment')} maxLength="250"></input>
                                            <label htmlFor="floatingInputGrid">Comment</label>
                                            {formData.comment.isInvalid && <div className="small text-danger">Comment is required</div>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-6" style={{textAlign:"right"}}>
                                        <br/>
                                            <button type="submit" className="btn btn-outline-primary btnStyle">Save</button>  
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}