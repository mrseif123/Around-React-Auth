import React from 'react';
import { Link, useHistory} from 'react-router-dom';

function Login({
    email,
    loggedIn,
    userEmail,
    setUserEmail,
    password,
    setPassword,
    handleLogin,
    setEmail,
  }) {

  const history = useHistory();

  React.useEffect(() => {
    if (loggedIn) {
      history.push('/main');
      setUserEmail(email || userEmail);
    }
  });

  return (
    <>
      <div className='authentication__container'>
        <h2 className='authentication__title'>Log in</h2>
        <form
          action='#'
          className='authentication'
          title='Log in'
          onSubmit={handleLogin}
        >
          <input
            className='form__input_dark'
            placeholder='Email'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input className='form__input_dark' placeholder='Password' type='password' required value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit' className='form__submit-button_dark' onClick={handleLogin} to='/main' >Log in </button>
        </form>
        <Link className='authentication__link' to='/signup'>Not a member yet? Sign up here!</Link>
      </div>
    </>
  );
}
export default Login; 