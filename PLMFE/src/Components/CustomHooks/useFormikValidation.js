export default function useFormikValidation(){

    const checkErrorsAndFocusOnFields = (errors,setFieldTouched,handleSubmit,evnt) => {
        //setFieldTouched('required',true);
        console.log("Errors====== ",errors);
        let errorKeys = Object.keys(errors);
        if (errorKeys.length === 0)  {
        handleSubmit(evnt);
        }
        else{
        errorKeys.forEach((el) => {
            setFieldTouched(el,true);
        })

        let divElems = document.querySelectorAll('[id*="justify-tab-example-tabpane"]')
        //console.log("divElems==============",divElems)
        if(divElems.length>0){
            let inputField = '';
            let containsDiv = '';
            for(var i=0;i<divElems.length;i++){
            inputField = divElems[i].querySelector(`input[name="${errorKeys[0]}"]`)
            //console.log("Input Field===== ",inputField);
            if(inputField !== null || inputField !== undefined){ 
                containsDiv =  divElems[i];   
                break;
            }
            }

            if(containsDiv !== '' && inputField !== ''){
            //console.log("Contains Div===== ",containsDiv,inputField);
            const ariaLabelledByValue = containsDiv.getAttribute('aria-labelledby');
            //console.log("Contains Div ariaLabelledByValue===== ",ariaLabelledByValue);
            document.getElementById(ariaLabelledByValue).click()
            setTimeout(() => {
                inputField.focus();
            }, 500);
            }
            /*divElems.every((el)=>{
            const inputField = el.querySelector(`input[name="${errorKeys[0]}"]`)
            console.log("Input Field===== ",inputField);
            if(inputField){     
                return false;
            }
            })*/
        }
        else{
            document.getElementsByName(errorKeys[0])[0].focus();
        }
        
        
        }
    }


    const testYupFieldValue = (fieldValue) => {
        //console.log("Inside testYupFieldValue name==== ",fieldValue);
        const prohibitedValues = ['',undefined,null];
        if(fieldValue === null || fieldValue === undefined || !fieldValue){
            return true;
        }
        else{
            if(fieldValue.hasOwnProperty("value")){
                return !prohibitedValues.includes(fieldValue.value);
            }
            else{

                return !prohibitedValues.includes(fieldValue);
            }
        
        }
    }

    const checkYupValidation = (delegated,decision) => {
        console.log("decison",decision);
        if(decision !== 'Discard'){
        //console.log("Inside checkYupValidation delegated==== ",delegated);
        if(delegated === null || delegated === undefined){
            return false;
        }
        else{
            if(delegated.hasOwnProperty("value")){
                return (delegated.value !== undefined)?delegated.value.toLowerCase()==="yes":false
            }
            else{

                return (delegated !== undefined)?delegated.toLowerCase()==="yes":false;
            }
        }
    }
    else{
        return false;
    }
    }

    return {
        checkYupValidation,
        checkErrorsAndFocusOnFields,
        testYupFieldValue
    }
}