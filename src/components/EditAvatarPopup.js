import React from "react";
import PopupWithForm from "./PopupWithForm"

function EditAvatarPopup(props) {
  const avatarReference = React.useRef(null)
  
  function handleSubmit(e){
    e.preventDefault()
    props.onUpdateAvatar({
      avatar: avatarReference.current.value,
    })
  }
  
  return (
      <PopupWithForm name="avatar" title="Change profile picture" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
        <input className="form__field form__field_link" type="url" name="link" id="link2" placeholder="Image link" required ref={avatarReference}/>
        <span className="form__field-error link2-error" />
      </PopupWithForm>
  )
}

export default EditAvatarPopup;