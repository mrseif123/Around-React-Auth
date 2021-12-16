import React from 'react';
import PopupWithForm from "./PopupWithForm"
import ImagePopup from "./ImagePopup";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import api from '../utils/api';
import { CurrentUserContext } from "../contexts/CurrentUserContext"
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  // const [cards, setCards] = React.useState([])


  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleDeleteClick() {
    setIsDeletePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
  }

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((userProfile) => {
        setCurrentUser(userProfile);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleUpdateUser(data) {
    api
      .updateProfile(data)
      .then((res) => {
        setCurrentUser(res);
        setIsEditProfilePopupOpen(false);
      })
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
    api.
    addCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  const [cards, setCards] = React.useState([]);

  function handleCardLike(card) {
    api.likeCard(card._id, false).then((newCard) => {
        setCards((state) => state.map((item) => item._id === card._id ? newCard : item))
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDislike(card) {
    api.removeLike(card._id, true).then((newCard) => {
        setCards((state) => state.map((item) => item._id === card._id ? newCard : item))
      })
      .catch((err) => {
        console.log(err);
      });
  }


  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    api.getGroupCards()
      .then((data) => {
        setCards((cards) => [...cards, ...data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick} onDeleteClick={handleDeleteClick}
         onCardClick={handleCardClick} cards={cards} handleCardDelete={handleCardDelete}
           handleCardLike={handleCardLike} handleCardDislike={handleCardDislike}
         />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />

      <PopupWithForm name="delete" title="Are you sure?" isOpen={isDeletePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

      <ImagePopup onClose={closeAllPopups} card={selectedCard} handleCardClick={handleCardClick} />

      <Footer />
    </CurrentUserContext.Provider>
  );
}

export default App;
