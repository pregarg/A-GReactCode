import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_SIGN_IN } from '../../actions/types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUpdateDecision from '../CustomHooks/useUpdateDecision';

export default function SessionTimeoutModal(navTo){    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {updateLockStatus} = useUpdateDecision();
    const authSelector = useSelector((state) => state.auth);
    const userId = authSelector.userId || 0;
    const expiry  = useSelector(state => state.auth.expiry);
    const [consfirmModal, setConfirmModal] = useState(false);
    let timer;

    useState(()=>{
        if((expiry*1000 - Date.now()) > 0){
            if(!!timer){
                clearTimeout(timer);
            }

            timer = setTimeout(()=>{
                let whereJson = {'LockedBy':userId};
                updateLockStatus('N','',0,whereJson);
                setConfirmModal(true);
            },(expiry*1000 - Date.now()) )
        }
    },[])
       
    const logout = ()=>{
        dispatch ({type:CLEAR_SIGN_IN,payload:null});
        navigate(navTo, true);
        setConfirmModal(false);
    }
   return( 
    <Modal
      onHide={logout}
      backdrop="static"
      keyboard={false}
      show={consfirmModal}
      dialogClassName="delete-modal-dialog"
      size="sm"
      aria-labelledby="example-custom-modal-styling-title"
      centered
    >
      <Modal.Header closeButton>
          <Modal.Title>
              <h5>Session expired</h5>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="container">
          <div className="row">
              <div className="col-md">
                  <p>Your session has been timed out</p>
              </div>
          </div>
      </div>
      </Modal.Body>
      <Modal.Footer>
          <button type="button" class="btn btn-success" onClick={logout}>Ok</button>
        
      </Modal.Footer>
    </Modal>
   )
}