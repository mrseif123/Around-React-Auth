class Api {
  constructor({
    baseUrl,
    headers
  }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  async getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
        headers: this._headers,
      })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
      )
      .catch((err) => {
        console.log(err);
      });
  }
  _checkResponse(res) {
    if (!res.ok) {
      return Promise.reject(`${res.status} error!`);
    }
    return res.json();
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
        headers: this._headers,
      })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
      )
      .catch((err) => {
        console.log(err);
      });
  }

  async updateProfile({
    name,
    about,
    id,
    link
  }) {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
        id,
        link
      }),
    });
    return this._checkResponse(res);
  }

  async updateAvatar({
    link
  }) {
    const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link
      }),
    });
    return this._checkResponse(res);
  }

  async addCard({
    name,
    link
  }) {
    const res = await fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name,
        link
      }),
    });
    return this._checkResponse(res);
  }

  async likeCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
    });
    return this._checkResponse(res);
  }

  async removeLike(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    });
    return this._checkResponse(res);
  }

  async deleteCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    });
    return this._checkResponse(res);
  }
}


const api = new Api({
  baseUrl: 'https://around.nomoreparties.co/v1/group-12',
  headers: {
    Authorization: '99b2ba57-5d11-48fc-a5da-07a4f1d8e8b5',
    "Content-Type": "application/json",
  }
});

export default api;