import React from "react";
import PopupWithForm from "./PopupWithForm"
import {
  CurrentUserContext
} from "../contexts/CurrentUserContext";

function EditProfilePopup(props){
  const currentUser = React.useContext(CurrentUserContext)
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");


  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about)
  }, [currentUser])

  function handleNameChange(e){
    setName(e.target.value)
  }

  function handleDescriptionChange(e){
    setDescription(e.target.value)
  }

  function handleSubmit(e){
    e.preventDefault()
    props.onUpdateUser({
      name: name,
      about: description
    })
  }

  return (
      <PopupWithForm name="form" title="Edit Profile" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} >
        <input className="form__field form__field_name" type="text" name="name" id="fullName" placeholder="Full Name" required minLength={2} maxLength={40} onChange={handleNameChange} />
        <span className="form__field-error fullName-error" />
        <input className="form__field form__field_about" type="text" name="about" id="about" placeholder="About" required minLength={2} maxLength={200} onChange={handleDescriptionChange} />
        <span className="form__field-error about-error" />
      </PopupWithForm>
  )
}

export default EditProfilePopup