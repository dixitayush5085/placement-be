const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors({
    origin: '*', // Allow all origins      
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all methods
  }));

let database;

async function connectDatabase() {
    try {
        database = await db.connectToDatabase();
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Connect to the database before handling requests
connectDatabase();

app.use(bodyParser.json()); // Parses JSON-encoded bodies

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const usersCollection = database.collection('admin');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Compare the provided password with the hashed password
        const passwordMatch = password == user.password ? true : false;

        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }
        const token = jwt.sign({ userId: user._id }, 'rituraj');

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: 'Error processing login' });
    }
});

app.post('/add-mentee', async (req, res) => {
    try {
        const data = req.body;
        const name = data.name; // Extract the mentee's name

        const collection = database.collection('mentee');

        // Check for existing mentees with the same name
        const existingMentee = await collection.findOne({ name });

        if (existingMentee) {
            res.status(400).json({ message: 'Mentee with the same name already exists' });
            return;
        }

        // If no duplicate found, proceed with insertion
        const result = await collection.insertOne(data);
        res.status(201).json({ message: 'Mentee added successfully', id: result.insertedId });
    } catch (err) {
        console.error("Error adding mentee:", err);
        res.status(500).json({ message: 'Error processing request' });
    }
});

app.patch('/update-mentee/:name', async (req, res) => {
    try {
      // Retrieve the mentee's name from the URL parameter
      const menteeName = req.params.name;
  
      // Extract update data from the request body
      const updateData = req.body;
  
      // Define update operators directly using updateData
      const updateOps = {
        $set: updateData,
      }; // No need for an extra $set wrapper
  
      const collection = database.collection('mentee');
      console.log(menteeName)
      const result = await collection.updateOne({ name: menteeName }, updateOps);
  
      if (result.matchedCount === 0) {
        res.status(404).json({ message: 'Mentee not found' });
        return;
      }
  
      res.status(200).json({ message: 'Mentee updated successfully' });
    } catch (error) {
      console.error("Error updating mentee:", error);
      res.status(500).json({ message: 'Error processing request' });
    }
  });
  

app.get('/get-mentee', async (req, res) => {
    try {
        const collection = database.collection('mentee');
        const result = await collection.find().toArray();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching mentees:", error);
        res.status(500).json({ message: 'Error processing request' });
    }
})


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
