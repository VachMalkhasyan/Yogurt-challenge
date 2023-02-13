const express = require('express');
const app = express();
const router = express.Router()
const Locations = require('./models/locations');

router.post("/customerLogs", async (req, res) => {
    try {
      const { locationId, startDate, endDate } = req.body;
      const customerLogs = await db.collection("customerLogs").aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),//greater than or equal to
              $lte: new Date(endDate)//less than or equal to
            }
          }
        },
        {
          $lookup: {//is an operator used to perform a left outer join on two collections
            from: "customers",
            localField: "customerId",
            foreignField: "customerId",
            as: "customer"
          }
        },
        {
          $unwind: "$customer"//it takes an array and creates separate documents for each element in the array
        },
        {
          $match: {
            "customer.locationId": locationId
          }
        },
        {
          $group: {
            _id: "$customer.customerId",
            logs: {
              $push: {
                type: "$type",
                text: "$text",
                date: "$date"
              }
            }
          }
        }
      ]).toArray();
      res.send(customerLogs);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
// Get all locations
router.get('/', async (req, res) => {
    try {
      const locations = await Location.find();
      res.json(locations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get a single location
router.get('/:id', getLocation, (req, res) => {
    res.json(res.location);
  });
  
  // Create a new location
  router.post('/', async (req, res) => {
    const location = new Locations({
      name: req.body.name,
      createdDate: req.body.createdDate,
    });
  
    try {
      const newLocation = await location.save();
      res.status(201).json(newLocation);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Update a location
  router.patch('/:id', getLocation, async (req, res) => {
    if (req.body.name != null) {
      res.location.name = req.body.name;
    }
    if (req.body.createdDate != null) {
      res.location.createdDate = req.body.createdDate;
    }
    try {
      const updatedLocation = await res.location.save();
      res.json(updatedLocation);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a location
  router.delete('/:id', getLocation, async (req, res) => {
    try {
      await res.location.remove();
      res.json({ message: 'Location has been deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Middleware function to get a location by ID
  async function getLocation(req, res, next) {
    let location;
    try {
      location = await Location.findById(req.params.id);
      if (location == null) {
        return res.status(404).json({ message: 'Cannot find location' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.location = location;
    next();
  }
  
  

//Get by ID Method
// router.get('/getOne/:id', (req, res) => {
//     res.send('Get by ID API')
// })

//Update by ID Method
// router.patch('/update/:id', (req, res) => {
//     res.send('Update by ID API')
// })

//Delete by ID Method
// router.delete('/delete/:id', (req, res) => {
//     res.send('Delete by ID API')
// })

module.exports = router;
