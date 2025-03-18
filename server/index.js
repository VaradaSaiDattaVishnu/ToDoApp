const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const io = new Server(server, {
  cors: {
    origin:"http://localhost:3003",
    methods: ["GET", "POST"]
  }
});
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
require('dotenv').config()

const uri = process.env.MONGODB_URI 

const client = new MongoClient(uri);
let tasksCollection;

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Database connected successfully");
    
    // Set up the collection reference
    tasksCollection = client.db('tododb').collection('tasks');
    
    // Set up change stream to monitor for changes
    const changeStream = tasksCollection.watch();
    
    // When a change occurs in MongoDB, emit to all connected clients
    changeStream.on('change', (change) => {
      io.emit('tasksUpdated', change);
    });
    
  } catch(e) {
    console.error("Failed to connect to MongoDB", e);
  }
}

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  console.log('A client connected');
  
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});


app.get('/', (req, res) => {
  res.send('Todo API Running');
});

app.post('/getTasks', async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray();
    res.json(tasks);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/updateTask', async(req, res) => {
  try {
    const {id, updatedTask} = req.body;
    const response = await tasksCollection.findOneAndUpdate(
      {id}, 
      {$set: updatedTask}, 
      { returnDocument: 'before' }
    );
    res.json({ after: updatedTask, before: response });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.post('/saveTask', async (req, res) => {
  try {
    const dataToSave = req.body;
    const {id, details, s, p, des, deadline, pindex, overdue} = dataToSave;
    await tasksCollection.insertOne({ 
      id, details, p, s, des, deadline, pindex, overdue 
    });
    const taskResponse = await tasksCollection.findOne({id: id}, {_id: 0});
    res.json(taskResponse);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to save task' });
  }
});

app.post('/updateTasksInDb', async (req, res) => {
  try {
    const {startIndex, endIndex, id, s} = req.body;
    if(!s) {
      if(endIndex > startIndex) {
        for(let i = startIndex + 1; i <= endIndex; i++) {
          let newIndex = `${i-1}`;
          await tasksCollection.updateOne(
            {pindex: `${i}`, s: false}, 
            {$set: {pindex: newIndex}}
          );
        }
        await tasksCollection.updateOne(
          {id}, 
          {$set: {pindex: `${endIndex}`}}
        );
      } else {
        for(let i = startIndex - 1; i >= endIndex; i--) {
          let newIndex = `${i+1}`;
          await tasksCollection.updateOne(
            {pindex: `${i}`, s: false}, 
            {$set: {pindex: newIndex}}
          );
        }
        await tasksCollection.updateOne(
          {id}, 
          {$set: {pindex: `${endIndex}`}}
        );
      }
    }
    res.json({ success: true });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update tasks order' });
  }
});

app.post('/deleteTask', async (req, res) => {
  try {
    const {id} = req.body;
    const response = await tasksCollection.deleteOne({id: id});
    res.json({response});
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});