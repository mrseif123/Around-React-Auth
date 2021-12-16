import React from "react";
import closingButtonImage from "../images/profile-add-icon.svg"

function PopupWithForm(props) {
  return (
    <section className={`popup popup_type_${props.name} ${props.isOpen ? "popup_visible" : ""}`} onSubmit={props.onSubmit}>
      <div className="popup__container" >
        <form form className="form" name={`form__${props.name}`} id={`popup_${props.name}`} action="#" >
          <button type="button" aria-label="close form" className="form__close-btn"
            id="close_button_profile" />
          <h2 className="form__title">{props.title}</h2>
          <button type="button" aria-label="close profile editing form" className="form__close-btn" id="close_button_profile" onClick={props.onClose}>
            <img className="form__close-img" src={closingButtonImage} alt="close button" />
          </button>
          {props.children}
          <button type="submit" className="form__submit-btn" id="form__profile-submit-button">{props.name !== "delete" ? "Save" : "Yes"}</button>
        </form>
      </div>
    </section>
  )
}
export default PopupWithForm;