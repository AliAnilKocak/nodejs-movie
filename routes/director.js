var express = require('express');
var router = express.Router();

// Models
const Director =require('../models/Director')
router.post('/', (req, res, next) => {
  //res.json({ title: 'Express' });
  const director = new Director(req.body);
  const promise = director.save();
  promise.then((data)=> {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  })
});

module.exports = router;
