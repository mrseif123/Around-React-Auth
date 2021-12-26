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
import authentication from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [tooltipMode, setTooltipMode] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [registered, setRegistered] = React.useState(false);

  const history = useHistory();

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
  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  function handleToolTip(res) {
    setTooltipMode(res);
    setIsInfoToolTipOpen(true);
  }

  function handleUpdateUser({ name, about }) {
    api
      .updateProfile({name, about})
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatar(avatar)
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

   React.useEffect(() => {
     const closeByEscape = (e) => {
       if (e.key === 'Escape') {
         closeAllPopups();
       }
     }

     document.addEventListener('keydown', closeByEscape)

     return () => document.removeEventListener('keydown', closeByEscape)
   }, [])

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .then((res) => closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleAddPlace({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then((res) => closeAllPopups())
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    if (loggedIn) {
      api.getUserInfo().then((userProfile) => {
        setCurrentUser(userProfile);
      }).catch((err) => {
        console.log(err)
      })

      api
        .getInitialCards()
        .then((data) => {
          if (data) {
            setCards((cards) => [...cards, ...data]);
          }
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
  function handleLogin(){
    setLoggedIn(true)
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
      }).catch((err) => {console.log(err)})
      .then(resetForm)
      .then(() => history.push('/main'))
      .catch((err) => console.log(err.message));
  };

  function handleRegisterSubmit (e) {
    e.preventDefault();
    authentication
      .register(email, password)
      .then((res) => {
        if (!res.data) {
          handleToolTip(false);
          throw new Error(`400 - ${res.message ? res.message : res.error}`);
        }
      })
      .then((res) => {
        setRegistered(true);
        history.push('/signin');
        return res;
      })
      .then((res) => {
        handleToolTip(true);
        return res;
      })
      .then(resetForm)
      .catch((err) => {
        setIsInfoToolTipOpen(true)
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
            loggedIn={loggedIn}
            email={email}
            link={{ description: 'Sign up', to: '/signup' }}
            onLogout={handleLogout}
          />
          <Login
            loggedIn={loggedIn}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleLoginSubmit={handleLoginSubmit}
            onLogout={handleLogout}
          />
        </Route>

        <Route path='/signup'>
          <Header
            loggedIn={loggedIn}
            email={email}
            link={{ description: 'Log In', to: '/signin' }}
            onLogout={handleLogout}
          />
          <Register
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleRegisterSubmit={handleRegisterSubmit}
            handleLogin={handleLogin}
          />
          </Route>

        <Route exact path='/'>
          {loggedIn ? <Redirect to='/main' /> : <Redirect to='/signin' />}
        </Route>

        <Route path='/main'>
          <Header
            loggedIn={loggedIn}
            email={email}
            link={{ description: 'Log out', to: '/signin' }}
            onLogout={handleLogout}
          />
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
        <Redirect from='*' to='/main' />

      </Switch>
      <InfoToolTip
        isOpen={isInfoToolTipOpen}
        success={tooltipMode}
        onClose={closeAllPopups}
        loggedIn={loggedIn}
      />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
