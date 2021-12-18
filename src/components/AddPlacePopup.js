import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [name, setName] = React.useState('')
  const [link, setLink] = React.useState('')

  function handleNameChange(e) {
    setName(e.target.value)
  }

  function handleLinkChange(e) {
    setLink(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    props.onAddPlace({ name, link })
  }

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen]);

  return (
    <PopupWithForm name='add' title='New Place' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
      <input className='form__field form__field_title' type='text' onChange={handleNameChange} value={name} name='about' id='title' placeholder='Title' required minLength={1} maxLength={30} />
      <span className='form__field-error title-error' />
      <input className='form__field form__field_link' type='url' onChange={handleLinkChange} value={link}  name='link' id='link' placeholder='Image link' required />
      <span className='form__field-error link-error' />
    </PopupWithForm>
  )
}

export default AddPlacePopup;
