const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://movie_user:abcd1234@ds211309.mlab.com:11309/movie-api');

  mongoose.connection.on('open',()=>{
    console.log('MongoDB Connected');
  });

  mongoose.connection.on('error',(err)=>{
    console.log('MongoDB: Error',err);
  });


  mongoose.Promise = global.Promise;
};
