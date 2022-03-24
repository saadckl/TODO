require('dotenv').config();
const express = require('express');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const router = require('./routes/routes');
const Model = require('./models/model');
const app = express();
app.use(express.json());
app.use('/api', router)

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

// Middleware
app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next()
  });

router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age
    })
    try{
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
});

router.get('/getAll',  async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data);
    }
    catch{
        res.status(500).json({message: error.message})
    }
});

router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch{
        res.status(500).json({message: error.message})
    }
});

router.patch('/update/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})