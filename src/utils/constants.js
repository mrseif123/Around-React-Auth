export const validationConfig = {
  inputSelector: ".form__field",
  submitButtonSelector: ".form__submit-btn",
  inactiveButtonClass: "form__submit-btn_inactive",
  inputErrorClass: "form__field_invalid",
  errorClass: "form__input-error_active",
  formSelector: ".form"
}

export const editButton = document.querySelector(".profile__edit-btn");
export const addButton = document.querySelector(".profile__add-btn");
export const profileName = document.querySelector(".profile__name");
export const profileSubtitle = document.querySelector(".profile__subtitle");
export const profileAvatar = document.querySelector(".profile__avatar");
export const avatarButton = document.querySelector('.profile__edit-overlay');
export const profileSubmitButton = document.getElementById("form__profile-submit-button")
export const addSubmitButton = document.getElementById("form__place-submit-button")

export const nameField = document.querySelector(".form__field_name");
export const subtitleField = document.querySelector(".form__field_about");


export const imageAdderForm = document.querySelector('.add-container');
export const editProfileForm = document.querySelector('.form-container');
export const avatarFrom = document.querySelector('.avatar-container');