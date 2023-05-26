const mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.set('strictQuery', true);

  mongoose.connect(url)
    .then(() => console.log('Đã kết nối với DB Mongoose'))
    .catch((error) => console.log(error));
}

module.exports = connectDB;