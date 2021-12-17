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
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
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

  function handleToolTip(success) {
    setTooltipMode(success);
    setIsInfoToolTipOpen(true);
  }

  function handleUpdateUser({ name, about }) {
    api
      .updateProfile(name, about)
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditProfilePopupOpen(false);
      })
      .then((res) => closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatar(avatar)
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditAvatarPopupOpen(false);
      })
      .then((res) => closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        // Create a new array based on the existing one and putting a new card into it
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        // Update the state
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    // const isOwn = card.owner._id === currentUser._id;
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .then((res) => closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleAddPlace({ title, link }) {
    api
      .addNewCard({ title, link })
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
    // const [email, password] = [e.target.email.value, e.target.password.value];
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

  function handleRegisterSubmit (e) {
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
          setUserEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, userEmail]);


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
