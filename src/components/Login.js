import React from 'react';
import { Link, useHistory} from 'react-router-dom';

function Login({
    email,
    loggedIn,
    password,
    setPassword,
    handleLoginSubmit,
    setEmail,
  }) {

  const history = useHistory();

  React.useEffect(() => {
    if (loggedIn) {
      history.push('/main');
      setEmail(email);
    }
  }, [loggedIn]);

  return (
    <div className='authentication__container'>
        <h2 className='authentication__title'>Log in</h2>
        <form
          action='#'
          className='authentication'
          title='Log in'
          onSubmit={handleLoginSubmit}
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
          <button type='submit' className='form__submit-btn_dark'>Log in </button>
        </form>
        <Link className='authentication__link' to='/signup'>Not a member yet? Sign up here!</Link>
    </div>
  );
}
export default Login;