import React from 'react'
import { Alert } from 'react-bootstrap'

export default function AlertModal(prop) {
  return (
    <>
        <Alert show={prop.show} variant={prop.variant} onClose={() => prop.alertShowHide({show:false,message:'',variant:''})} dismissible>
        <Alert.Heading>Alert!</Alert.Heading>
        <p>
          {prop.message}
        </p>
      </Alert>
    </>
  )
}
