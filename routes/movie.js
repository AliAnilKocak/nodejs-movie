var express = require('express');
var router = express.Router();

//Models
const Movie = require('../models/Movie');

router.get('/',(req,res)=>{
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind: '$director'
    }
  ]); // bütün filmlerin listelenmesi
  promise.then((data)=> {
    res.json(data);
  }).catch((err)=> {
    res.json(err);
  })
});

//top 10
router.get('/top10',(req,res)=>{
  const promise = Movie.find({ }).limit(10).sort({imdb_score: 1}); // bütün filmlerin listelenmesi
  promise.then((data)=> {
    res.json(data);
  }).catch((err)=> {
    res.json(err);
  })
});

router.get('/:movie_id',(req,res,next)=>{
   //res.send(req.params); //tarayıcıdan movie_id kısmına girilen datayı req.params ile aldık
   const promise = Movie.findById(req.params.movie_id);//girilen id ye göre veriyi getirir.
   promise.then((movie)=>{
     if(!movie)
     next({message: 'The movie was not found'});
     res.json(movie);
   }).catch((err)=> {
     res.json(err);
   });
});


router.put('/:movie_id',(req,res,next)=>{
   //res.send(req.params); //tarayıcıdan movie_id kısmına girilen datayı req.params ile aldık
   const promise = Movie.findByIdAndUpdate(
     req.params.movie_id,
     req.body,
     {new: true} // güncellenen datayla birlikte koleksiyonunun yazdırılması
   );// güncelleme işlemini yapar.(put)
   promise.then((movie)=>{
     if(!movie)
     next({message: 'The movie was not found'});
     res.json(movie);
   }).catch((err)=> {
     res.json(err);
   });
});


router.delete('/:movie_id',(req,res,next)=>{
   //res.send(req.params); //tarayıcıdan movie_id kısmına girilen datayı req.params ile aldık
   const promise = Movie.findByIdAndRemove(req.params.movie_id);//girilen id ye göre veriyi getirir.
   promise.then((movie)=>{
     if(!movie)
     next({message: 'The movie was not found'});
     res.json(movie);
   }).catch((err)=> {
     res.json(err);
   });
});

//between

router.get('/between/:start_year/:end_year',(req,res)=>{
  const {start_year,end_year} = req.params;
  const promise = Movie.find(
    {
       year: { "$gte" :parseInt(start_year), "$lte": parseInt(end_year)}
    }
  );
  promise.then((data)=> {
    res.json(data);
  }).catch((err)=> {
    res.json(err);
  })
});



router.post('/', function(req, res, next) {
//  const {title, imdb_score, category, country, year} = req.body; //post ile gelen dataları json formatında tutar
  //res.send(title);
/*  const movie = new Movie({
    title: title, //sağdaki gelen posttaki title
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  });*/

  const movie = new Movie(req.body); //yukarıdaki yerine bu şekilde tek halde de yazılabilr.
/*movie.save((err,data)=>{
    if(err)
    res.json(err);

    res.json(data);

  });*/

const promise = movie.save();

promise.then((data)=>{
  res.json({ status: 1});
}).catch((err)=>{
  res.json(err);
});



});

module.exports = router;
