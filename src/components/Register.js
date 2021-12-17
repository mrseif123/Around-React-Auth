import React from 'react';
import { Link } from 'react-router-dom';

function Register({registred, handleRegister, history, email, setEmail, password, setPassword}) {

  React.useEffect(() => {
    if (localStorage.getItem('token')){
      history.push('/main')
    }
  }, [history]);

  return (
    <>
      <div className='authentication__container'>
        <h2 className='authentication__title'>Sign up</h2>
        <form
          action="#"
          className = 'authentication'
          title='Sign up'
          onSubmit={handleRegister}
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
            className='form__submit-button_dark'
            onSubmit={handleRegister}
            to='/'
          >
            Sign up
          </button>
        </form>
        <Link className='authentication__link' to='/signin'>
          Already a member? Log in here!
        </Link>
      </div>
    </>
  );
}
export default Register;