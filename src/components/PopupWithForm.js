import React from 'react';
import closingButtonImage from '../images/profile-add-icon.svg'

function PopupWithForm(props) {
  return (
    <section className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_visible' : ''}`} >
      <div className='popup__container' >
        <form className='form' name={`form__${props.name}`} id={`popup_${props.name}`} action='#' onSubmit={props.onSubmit} >
          <button type='button' aria-label='close form' className='form__close-btn'/>
          <h2 className='form__title'>{props.title}</h2>
          <button type='button' aria-label='close profile editing form' className='form__close-btn' onClick={props.onClose}>
            <img className='form__close-img' src={closingButtonImage} alt='close button' />
          </button>
          {props.children}
          <button type='submit' className='form__submit-btn'>{props.name !== 'delete' ? 'Save' : 'Yes'}</button>
        </form>
      </div>
    </section>
  )
}
export default PopupWithForm;