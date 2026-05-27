const path = require('path');

const getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
};

const redirectLogin = (req, res) => {
  res.redirect('/login');
};

module.exports = {
  getLogin,
  redirectLogin
};
