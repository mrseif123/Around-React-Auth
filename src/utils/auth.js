class Authentication {
  constructor(options) {
    this.options = options;
  }

  _checkResponse(res) {
    if (!res.ok) {
      return Promise.reject(`${res.status} error!`);
    }
    return res.json();
  }

  register(email, password) {
    return this.request('/signup', 'POST', JSON.stringify({
      email,
      password
    }));
  }

  authorize(userid, password) {
    return this.request(
      '/signin',
      'POST',
      JSON.stringify({
        email: userid,
        password: password
      })
    );
  }

  async getContent(token) {
    return fetch(`${this.options.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return this._checkResponse(res)
    });
  }

  async request(auth, method, body) {
    return fetch(`${this.options.baseUrl}${auth}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method,
        body,
      })
      .then((res) => {
        return this._checkResponse(res)
      })
      .then((data) => {
        if (!data.message) {
          localStorage.setItem('token', data.token);
          return data;
        } else {
          return;
        }
      });
  }
}
const authentication = new Authentication({
  baseUrl: 'https://register.nomoreparties.co',
});

export default authentication;