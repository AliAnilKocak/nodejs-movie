const mongoose = require('mongoose');
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

router.get('/',(req,res)=>{
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies:{
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'

      }
    }
  ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  })
});

router.get('/:director_id',(req,res)=>{
  const promise = Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id)   //object id tipinde yollamak için
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies:{
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'

      }
    }
  ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  })
});

//update

router.put('/:director_id',(req,res,next)=>{
   //res.send(req.params); //tarayıcıdan movie_id kısmına girilen datayı req.params ile aldık
   const promise = Director.findByIdAndUpdate(
     req.params.director_id,
     req.body,
     {new: true} // güncellenen datayla birlikte koleksiyonunun yazdırılması
   );// güncelleme işlemini yapar.(put)
   promise.then((director)=>{
     if(!director)
     next({message: 'The director was not found'});
     res.json(director);
   }).catch((err)=> {
     res.json(err);
   });
});

//delete

router.delete('/:director_id',(req,res,next)=>{
   //res.send(req.params); //tarayıcıdan movie_id kısmına girilen datayı req.params ile aldık
   const promise = Director.findByIdAndRemove(req.params.director_id);//girilen id ye göre veriyi getirir.
   promise.then((director)=>{
     if(!director)
     next({message: 'The director was not found'});
     res.json(director);
   }).catch((err)=> {
     res.json(err);
   });
});

module.exports = router;
