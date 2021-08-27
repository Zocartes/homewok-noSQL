const router = require('express').Router();
const db = require('../models/');

// route for adding a new workout
router.post('/api/workouts', ({ body }, res) => {
  db.Workout.create(body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res / status(400).json(err);
    });
});

// route for retrieving workouts and adding the field total duration that is equal to the sum of all durations
router.get('/api/workouts', (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: '$exercises.duration',
        },
      },
    },
  ])
    .then((dbWorkout) => {
      console.log(dbWorkout);
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// route to update excersise
router.put('/api/workouts/:id', (req, res) => {
  db.Workout.updateOne(
    {
      _id: req.params.id,
    },
    {
      $push: { exercises: req.body },
    }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/api/workouts/range', (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: '$exercises.duration' },
      },
    },
  ])
    .limit(7)
    .then((dbWorkout) => {
      console.log(`range: ${dbWorkout}`);
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
