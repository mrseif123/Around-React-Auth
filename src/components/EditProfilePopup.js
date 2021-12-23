import React from 'react';
import PopupWithForm from './PopupWithForm'
import {
  CurrentUserContext
} from '../contexts/CurrentUserContext';

function EditProfilePopup(props){
  const currentUser = React.useContext(CurrentUserContext)
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');


  React.useEffect(() => {
    setName(currentUser && currentUser.name);
    setAbout(currentUser && currentUser.about)
  }, [currentUser, props.isOpen])

  function handleNameChange(e){
    setName(e.target.value)
  }

  function handleDescriptionChange(e){
    setAbout(e.target.value)
  }

  function handleSubmit(e){
    e.preventDefault()
    props.onUpdateUser({
      name: name,
      about: about
    })
  }

  return (
      <PopupWithForm name='form' title='Edit Profile' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} >
        <input className='form__field form__field_name' type='text' name='name' id='fullName' placeholder='Full Name' required minLength={2} maxLength={40} onChange={handleNameChange} value={name || ""}/>
        <span className='form__field-error fullName-error' />
        <input className='form__field form__field_about' type='text' name='about' id='about' placeholder='About' required minLength={2} maxLength={200} onChange={handleDescriptionChange} value={about || ""} />
        <span className='form__field-error about-error' />
      </PopupWithForm>
  )
}

export default EditProfilePopup