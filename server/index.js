const express = require('express')
const app = express()
const port = 3003
var cors = require('cors')
var bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
// Connection URI
const uri =
  "mongodb://127.0.0.1:27017/mydb?writeConcern=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Database connected successsfully");
  }
  catch(e){
    console.log(e)
  }
}
run()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hi')
})



app.post('/getTasks', async (req, res) => {
  try{
  const tasks = await client.db('mydb').collection('tasks').find().toArray()
  res.json(tasks)
  }catch(err){
      console.log(err);
  }
  
})

app.post('/updateTask', async(req, res) => {
  
    const {id, updatedTask} = req.body
    const response = await client.db('mydb').collection('tasks').findOneAndUpdate({id}, {$set: updatedTask}, { returnDocument: 'before' }) 
  res.json({ after: updatedTask, before: response })
})



app.post('/saveTask', async (req, res) => {
  const dataToSave = req.body
  const {id, details, s, p, des, deadline, pindex, overdue} = dataToSave
  await client.db('mydb').collection('tasks').insertOne({
      id, details, p, s, des, deadline, pindex, overdue
  })
  const taskResponse = await client.db('mydb').collection('tasks').findOne({id: id}, {_id: 0})
  res.json(taskResponse)
})

app.post('/updateTasksInDb', async (req, res) => {

  const {startIndex, endIndex, id, s} = req.body
  
  if(!s){

    if(endIndex > startIndex) {
      for(let i = startIndex + 1; i<= endIndex; i++ ) {
        let newIndex = `${i-1}`
        await client.db('mydb').collection('tasks').updateOne({pindex: `${i}`, s: false}, {$set: {pindex: newIndex}})
      }
      await client.db('mydb').collection('tasks').updateOne({id }, {$set: {pindex: `${endIndex}`}})
   }
  
   else{
    for(let i = startIndex - 1 ; i >= endIndex; i-- )
      { let newIndex = `${i+1}`
       let response =  await client.db('mydb').collection('tasks').updateOne({pindex: `${i}`, s: false}, {$set: {pindex: newIndex}})
      }
      await client.db('mydb').collection('tasks').updateOne({id }, {$set: {pindex: `${endIndex}`}})
   }

  }

  res.json('huehuehue')


 

})

app.post('/deleteTask', async (req, res) => {


  const {id, tasksLength,s} = req.body
  // let indexS = await client.db('mydb').collection('tasks').findOne({id: id })
  


  const response = await client.db('mydb').collection('tasks').deleteOne({id: id})
  res.json({response})

//   if(s){
//     let index = Number(indexS.cindex)
//   for(let i = index; i <= tasksLength; i++) {
//     await client.db('mydb').collection('tasks').updateOne({cindex: `${i+1}`, s: true}, {$set: {cindex: `${i}`}})
//   }
// }
// else if(!s){
//   let index = Number(indexS.pindex)

//   for(let i = index; i <= tasksLength; i++) {
//     await client.db('mydb').collection('tasks').updateOne({pindex: `${i+1}`, s: false}, {$set: {pindex: `${i}`}})
//   }
// }


})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// await client.db('mydb').collection('tasks').updateMany({pindex: {$gt : 3}}, {$inc : {pIndex : -
//   1}}})