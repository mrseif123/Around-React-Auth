import React from 'react';
import { Link } from 'react-router-dom';

function Register({
  handleRegisterSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) {

  return (
      <div className='authentication__container'>
        <h2 className='authentication__title'>Sign up</h2>
        <form
          action="#"
          className = 'authentication'
          title='Sign up'
          onSubmit={handleRegisterSubmit}
        >
          <input
            className='form__input_dark'
            placeholder='Email'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='form__input_dark'
            placeholder='Password'
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type='submit'
            className = 'form__submit-btn_dark'
            onSubmit={handleRegisterSubmit}
          >
            Sign up
          </button>
        </form>
        <Link className='authentication__link' to='/signin'>
          Already a member? Log in here!
        </Link>
      </div>
  );
}
export default Register;