const User = require('../models/userModel');

const userController = {
  getAllUsers: (req, res) => {
    User.getAll((err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
      } else {
        res.json(results);
      }
    });
  }
};

module.exports = userController;
