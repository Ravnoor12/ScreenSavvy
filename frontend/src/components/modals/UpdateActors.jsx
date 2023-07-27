import React, { useState } from 'react'
import { useNotification } from '../../hooks';
import ModalContainer from './ModalContainer'
import ActorForm from '../form/ActorForm';
import { updateActor } from '../../api/actor';

export default function UpdateActors({visible,onClose,initialState,onSuccess}) {
    const [busy,setBusy] = useState(false);
  const {updateNotification} =  useNotification();
  const handleSubmit = async(data)=>{
    setBusy(true);
    const {error,actor} = await updateActor(initialState.id,data);
    setBusy(false);
    if(error) return updateNotification('error',error);
    onSuccess(actor);
    updateNotification('success','Actor updated successfully');
    onClose();
  }
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm onSubmit={!busy ? handleSubmit: null} title='Update Actor' 
      busy = {busy} btnTitle='Update' initialState={initialState}/>
    </ModalContainer>
  )
}
