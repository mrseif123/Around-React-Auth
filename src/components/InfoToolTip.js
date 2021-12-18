import React from 'react';

function InfoToolTip(props) {

  return (
    <section
      className={`form form__${props.name} ${
        props.isOpen ? 'form_visible' : ''
      }`}
    >
      <div className='form__result'>
        <div
          className={`form__tools ${
             props.success === 'success'
              ? `form__tools_success`
              : `form__tools_error`
          }`}
        />
        <p className='form__tools-message'>
          {/* {message} */}
          {props.success === 'success'
            ? 'Success! You have now been registered.'
            : 'Oops, something went wrong! Please try again.'}
        </p>
        <button
          className='form__close-btn'
          type='reset'
          aria-label='Close button'
          onClick={props.onClose}
        ></button>
      </div>
    </section>
  );
}

export default InfoToolTip;