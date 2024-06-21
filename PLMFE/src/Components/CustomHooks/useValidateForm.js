import React , { useState } from 'react'
import {omit} from 'lodash'

export default function useValidateForm() {

    const [errors, setErrors] = useState({});
  
    const validate = (event) => {
        // console.log("Event: ",event.target);
        // console.log("Inside validate",event.target.maxLength);
        //console.log("Inside validate required flag",event.target.required);
        const type = event.target.type;
        const requiredFlag = event.target.required;
        const maxLength = event.target.maxLength;
        const name = event.target.name;
        const value = event.target.value;
        const valueLength = value.length;
        let errorMsg = '';

        switch(type) {
            case 'text':
                if((valueLength > maxLength) 
                || ((value === '' || value === undefined) && requiredFlag === true)){
                    if(valueLength > maxLength){
                        errorMsg = name+' can only contain ' + maxLength +' letters'
                    }

                    if((value === '' || value === undefined) && requiredFlag === true){
                        errorMsg = name+' is mandatory';
                    }
                    setErrors({
                        ...errors,
                        [name]:errorMsg
                    })
                }
                else{
                    let newObj = omit(errors, name);
                    setErrors(newObj);
                }
            break;

            case 'email':
                if(
                    !new RegExp( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value) 
                    || ((value === '' || value === undefined) && requiredFlag === true)
                ){

                    if(!new RegExp( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)){
                        errorMsg = 'Enter a valid email address'
                    }

                    if((value === '' || value === undefined) && requiredFlag === true){
                        errorMsg = name+' is mandatory';
                    }
                    setErrors({
                        ...errors,
                        [name]:errorMsg
                    })
                }
                else{
                    let newObj = omit(errors, name);
                    setErrors(newObj);
                }
                break;
            
            case 'number':
                if(
                    !new RegExp( /^\d+$/).test(value) 
                    || ((value === '' || value === undefined) && requiredFlag === true)
                ){
                    if(!new RegExp( /^\d+$/).test(value)){
                        errorMsg = 'Enter Numbers only'
                    }

                    if((value === '' || value === undefined) && requiredFlag === true){
                        errorMsg = name+' is mandatory';
                    }
                }
                setErrors({
                    ...errors,
                    [name]:errorMsg
                })
                if(
                    new RegExp( /^\d+$/).test(value)
                ){
                    let newObj = omit(errors, name);
                    setErrors(newObj);
                    if(maxLength!==undefined && (valueLength>0 && valueLength>maxLength)){
                        errorMsg =  name+' can only contain ' + maxLength + ' values'
                    }
                    setErrors({
                        ...errors,
                        [name]:errorMsg
                    })
                }
                else{
                    let newObj = omit(errors, name);
                    setErrors(newObj);
                }
                break;
        }
    }

    const handleSubmit = () => {
        if(Object.keys(errors).length === 0){
            return true;

        }else{
           return false;
        }
    }

    return {
        validate,
        errors,
        handleSubmit
    }
}
