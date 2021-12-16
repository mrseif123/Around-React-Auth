import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext"

function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);

  const isOwner = props.card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = (
    `${isOwner ? 'elements__delete-btn' : ''}`
  );

  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = (
    `elements__like-btn ${isLiked ? 'elements__like-btn_active' : ''}`
  );

  function handleCardLike(e) {
    e.stopPropagation()
    e.preventDefault()
    props.onCardLike(props.card)
  }

  function handleCardDislike(e) {
    e.stopPropagation()
    e.preventDefault()
    props.onCardDislike(props.card)
  }

  function handleCardDelete(e) {
    e.stopPropagation();
    e.preventDefault();
    props.onDeleteClick(props.card);
  }

  return (
    <li className="elements__item">
      <img className="elements__img" src={props.card.link} alt={props.card.name} onClick={() => { props.onCardClick(props.card) }} />
      <div className="elements__description" >
        <h2 className="elements__title">{props.card.name}</h2>
        <div className="elements__like-container">
          <button type="button" aria-label="like image" className={cardLikeButtonClassName} onClick={isLiked ? handleCardDislike : handleCardLike}></button>
          <p className="elements__likes">{props.card.likes.length}</p>
        </div>
      </div>
      <button type="button" aria-label="delete icon" className={cardDeleteButtonClassName} onClick={handleCardDelete}></button>
    </li>
  );
}

export default Card;