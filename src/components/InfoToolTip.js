import React from 'react';
import closingButtonImage from '../images/profile-add-icon.svg'

function InfoToolTip(props) {

  return (
    <section className={`popup ${props.isOpen ? 'popup_visible' : ''}`}>
      <div div className = 'popup__container' >
        <div
          className={`form__tooltip ${
            props.success === 'success'
              ? `form__tooltip_success`
              : `form__tooltip_error`
          }`}
        />
        <p className='form__tooltip-message'>
          {props.success === 'success'
            ? 'Success! You have now been registered.'
            : 'Oops, something went wrong! Please try again.'}
        </p>
          <button type='button' aria-label='close profile editing form' className='form__close-btn' onClick={props.onClose}>
            <img className='form__close-img' src={closingButtonImage} alt='close button' />
          </button>
      </div>
    </section>
  );
}

export default InfoToolTip;
