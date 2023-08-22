// where route handlers are defined
//const fs = require('fs');
const Tour = require('./../models/tourModel');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
// middleware
exports.aliasTopTours = (req, res, next) => {
  // pre-filling parts of the query objects
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD THE QUERY
    // 🍉 1a) FILTERING
    //hard copy of the query object, the ... copies all the fields of the obj (distructing)
    const queryObj = { ...req.query };
    // ignore these fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 🍉 1b) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // match string and replace using callback to return the new string by adding a $ in front of the match
    // save to the queryStr
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    // {duration {$gte: 5}, difficulty: 'easy'}
    // { duration: { gte: '5' }, difficulty: 'easy' }
    let query = Tour.find(JSON.parse(queryStr));

    // 🧊 2 SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
      //sort('price ratingsAverage');
    } else {
      // set the default sort by creation date
      query = query.sort('-createdAt');
    }

    // 🍋 3. FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // minus is negation
      query = query.select('-__v');
    }

    // 📖 PAGINATION
    // by default display 100 results to the users
    // convert a string to a number by * 1
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //page-2limit=10, 1-10, page 1, 11-20, page 2
    query = query.skip(skip).limit(limit);
    // throw an error if user requests an invalid page
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exists');
      }
    }

    // EXECUTE THE QUERY
    const tours = await query;
    // each function returns a query that allows to chain new queries on it
    // const tours = await Tour.find()
    // .where('duration')
    // .gte(5)
    // .where('difficulty')
    // .equals('easy');
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'failed to get all tours',
    });
  }
};

// refactor the route handlers as functions
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //=== Tour.findOne({ -id: req.params.id})
    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'failed to get all tours',
    });
  }
};
// async await
exports.createTour = async (req, res) => {
  //   const newTour = new Tour({});
  //   newTour.save();
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // query the document and update it
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // validate the
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id);
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data',
    });
  }
};
