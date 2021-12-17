import React from 'react';
import { Route, Switch, withRouter, useHistory, Redirect } from 'react-router-dom'

import { CurrentUserContext } from '../contexts/CurrentUserContext'

import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login'
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoToolTip';
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import api from '../utils/api';
import authentication from '../utils/Authentication';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] =  React.useState([]);
  const [loggedIn, setLoggedIn] =  React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [registered, setRegistered] = React.useState(false);
  const [tooltipMode, setTooltipMode] = React.useState(false);

  const history =  useHistory();

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleToolTip(success) {
    setTooltipMode(success);
    setIsInfoToolTipOpen(true);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  React.useEffect(() => {
    if (loggedIn) {
      api.getUserInfo() 
      .then((userProfile) => { setCurrentUser(userProfile)})
      .catch((err) => { console.log(err) })
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((cards) => {
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  function handleUpdateUser(data) {
    api
      .updateProfile(data)
      .then((res) => {
        setCurrentUser(res);
        setIsEditProfilePopupOpen(false);
      })
      .then(() => closeAllPopups())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatar(avatar)
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditAvatarPopupOpen(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(data) {
    api.addCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .then(() => closeAllPopups())
    .catch((err) => {
      console.log(err);
    });
  }

  function handleCardLike(card) {
    api.likeCard(card._id, false).then((newCard) => {
        setCards((state) => state.map((item) => item._id === card._id ? newCard : item))
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // function handleCardDislike(card) {
  //   api.removeLike(card._id, true).then((newCard) => {
  //       setCards((state) => state.map((item) => item._id === card._id ? newCard : item))
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((item) => item._id !== card._id));
      })
      .then(() => closeAllPopups())
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    if (loggedIn) {
      api.getUserInfo().then((userProfile) => {
        setCurrentUser(userProfile);
      });
      api
        .getInitialCards()
        .then((data) => {
          if (data) {
            setCards((cards) => [...cards, ...data]);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  function resetForm() {
    setEmail('');
    setPassword('');
  };

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    authentication
      .authorize(email, password)
      .then((data) => {
        if (data && data.token) {
          handleLogin();
        } else {
          resetForm();
          if (!email || !password) {
            throw new Error(
              '400 - one or more of the fields were not provided'
            );
          }
          if (!data) {
            throw new Error(
              '401 - the user with the specified email not found'
            );
          }
        }
      })
      .then(resetForm)
      .then(() => history.push('/main'))
      .catch((err) => console.log(err.message));
  };

  function handleRegisterSubmit(e) {
    e.preventDefault();
    authentication
      .register(email, password)
      .then((res) => {
        if (!res.data) {
          handleToolTip('error');
          throw new Error(`400 - ${res.message ? res.message : res.error}`);
        }
      })
      .then((res) => {
        setRegistered(true);
        history.push('/signin');
        return res;
      })
      .then((res) => {
        handleToolTip('success');
        return res;
      })
      .then(resetForm)
      .catch((err) => {
        console.log(err);
      });
  };

  function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/signin');
  }

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      authentication
        .getContent(token)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, email]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route path='/signin'>
          <Header
            userEmail={email}
            loggedIn={loggedIn}
            onLogout={handleLogout}
            link={{ description: 'Sign up', to: '/signup' }}
          />
          <Login
            loggedIn={loggedIn}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            userEmail={setEmail}
            setUserEmail={setEmail}
            handleLogin={handleLogin}
            handleLoginSubmit={handleLoginSubmit}
            onLogout={handleLogout}
            isOpen={isInfoToolTipOpen}
            handleToolTip={handleToolTip}
            success={tooltipMode}
          />
          <InfoToolTip
            isOpen={isInfoToolTipOpen}
            success={tooltipMode}
            onClose={closeAllPopups}
            loggedIn={loggedIn}
          />
        </Route>

        <Route path='/signup'>
          <Header
            userEmail={email}
            loggedIn={loggedIn}
            link={{ description: 'Log in', to: '/signin' }}
          />
          <Register
            registered={registered}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleRegisterSubmit={handleRegisterSubmit}
            setUserEmail={setEmail}
            handleLogin={handleLogin}
            handleToolTip={handleToolTip}
          />
          <InfoToolTip
            isOpen={isInfoToolTipOpen}
            success={tooltipMode}
            onClose={closeAllPopups}
            loggedIn={loggedIn}
          /></Route>

        <Route exact path='/'>
          {loggedIn ? <Redirect to='/main' /> : <Redirect to='/signin' />}
        </Route>
        <Route path='/main'>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlace}
          />
          <PopupWithForm
            name='Confirmation'
            title='Are you sure?'
            isOpen={false}
            onClose={closeAllPopups}
          />
          <ImagePopup onClose={closeAllPopups} card={selectedCard} />

          <Header
            loggedIn={loggedIn}
            userEmail={email}
            link={{ description: 'Log out', to: '/signin' }}
            onLogout={handleLogout}
          />
          <ProtectedRoute
            path='/main'
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onClose={closeAllPopups}
            isEditProfilePopupOpen={isEditProfilePopupOpen}
            isAddPlacePopupOpen={isAddPlacePopupOpen}
            isEditAvatarPopupOpen={isEditAvatarPopupOpen}
            selectedCard={selectedCard}
            cards={cards}
          />
          <Footer />
        </Route>
        {/* {loggedIn && <Footer />} */}
        <Redirect from='*' to='/' />
      </Switch>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
