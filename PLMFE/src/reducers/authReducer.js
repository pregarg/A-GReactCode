import { SIGN_IN, SIGN_OUT, CLEAR_SIGN_IN } from "../actions/types";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import jwt_decode from "jwt-decode";
// import useUpdateDecision from '../Components/CustomHooks/useUpdateDecision';
// import { useLocation } from 'react-router-dom';

//Whenever app gets booted up it runs all the reducers once so initial state is null
const INITIAL_STATE = {
  isSignedIn: false,
  userId: null,
  token: null,
  userType: null,
  userName: null,
  message: "",
  expiry: null,
  loginPage: null,
};

const getExpiry = (token) => {
  const expiry = jwt_decode(token).exp;

  return expiry;
};

//const {updateLockStatus} = useUpdateDecision();

const authReducer = (state = INITIAL_STATE, action) => {
  //let prop = useLocation();
  switch (action.type) {
    case SIGN_IN:
      console.log(action);
      if (
        action.payload &&
        action.payload.status &&
        action.payload.status < 400
      ) {
        console.log(action.payload);
        if (!action.payload.data.loginOutput.foundError) {
          return {
            ...state,
            isSignedIn: true,
            userId: action.payload.data.loginOutput.participant.userId,
            token: action.payload.data.loginOutput.participant.token,
            userType: action.payload.data.loginOutput.participant.userType,
            userName: action.payload.data.loginOutput.participant.userName,
            message: "message",
            expiry: getExpiry(
              action.payload.data.loginOutput.participant.token,
            ),
            loginPage: action.payload.data.loginOutput.participant.portalLogin,
            priviliges: action.payload.data.loginOutput.participant.privileges,
          };
        } else {
          return { ...state, message: action.payload?.data?.data?.case };
        }
      } else if (
        action.payload &&
        action.payload.status &&
        action.payload.status > 399
      ) {
        return {
          ...state,
          isSignedIn: false,
          userId: null,
          token: null,
          message: "",
        };
      }
    //break;
    case SIGN_OUT:
      if (state.isSignedIn) {
        storage.removeItem("persist:auth");
        state = undefined;
        return (state = INITIAL_STATE);
      }
    // break;
    case CLEAR_SIGN_IN:
      /*if(prop.state!==null && prop.state.caseNumber!==undefined){
               const promise = new Promise((resolve, reject) =>{
                   resolve(updateLockStatus('N',prop.state.caseNumber));
               });


               await promise
               .then(() => {
                   setTimeout(() => {
                       storage.removeItem('persist:auth');
                       state=undefined;
                       return (state=INITIAL_STATE);
                   }, 1000);
               })
               .catch((err) => {
                   console.error('Error in clear sign in : ',err);
                   storage.removeItem('persist:auth');
                   state=undefined;
                   return (state=INITIAL_STATE);
               });
           }*/
      // else{
      storage.removeItem("persist:auth");
      state = undefined;
      return (state = INITIAL_STATE);
    //}
    default:
      return state;
  }
};

const persistConfig = {
  key: "auth",
  storage: storage,
  blacklist: [],
};

export default persistReducer(persistConfig, authReducer);
