import React from "react";
import closeButton from "../images/profile-add-icon.svg"

function ImagePopup(props) {
  return (
    <div className={`popup popup_type_image ${Boolean(props.card) && 'popup_visible'}`}>
      <div className="popup__container-image" id="photo_popup" >
        <button className="popup__img-close-btn" type="button" aria-label="close photo addition form" onClick={props.onClose}>
          <img className="popup__close-img" src={closeButton} alt="close button" />
        </button>
        <img className="popup__place-image" src={props.card ? props.card.link : "#"} alt={props.card ? props.card.name : ""} />
        <h2 className="popup__photo-title">{props.card ? props.card.name : ""}</h2>
      </div>
    </div>
  )
}

export default ImagePopup;