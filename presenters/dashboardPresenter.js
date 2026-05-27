const path = require('path');

const getDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'farmer-dashboard.html'));
};

module.exports = {
  getDashboard
};
