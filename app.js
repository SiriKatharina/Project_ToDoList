//const client = require('./src/database.js')  
const client = require('./connection.js')
const express = require('express'); 
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({ origin: '*' }));

app.listen(3300, ()=>{
  console.log("Server is now listening at port 3300");
})

app.get('/todoelements',(req, res)=>{
  client.query(`SELECT id, name, description, prio, TO_CHAR(date, 'yyyy-mm-dd') as date FROM todoelements order by id desc`, (err, result)=>{
      if(!err){
        res.send(result.rows);
      } 
  });
  client.end;
})

app.get('/todoelements/:id', (req, res)=>{
  client.query(`Select * from todoelements where id=${req.params.id}`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
  client.end;
})

app.post('/todoelements', (req, res)=> {
  const todo = req.body;
  console.log(todo);
  let insertQuery = `insert into todoelements(name, description, prio, date) 
                     values('${todo.name}', '${todo.description}', '${todo.prio}', '${todo.date}')`

  client.query(insertQuery, (err, result)=>{
      if(!err){
         //res.send('Insertion was successful')
         res.json({"message": "Insertion was successful"});
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.put('/todoelements/:id', (req, res)=> {
  let todo = req.body;
  let updateQuery = `update todoelements
                     set name = '${todo.name}',
                     description = '${todo.description}',
                     prio = '${todo.prio}',
                     date = '${todo.date}'
                     where id = ${todo.id}`

  client.query(updateQuery, (err, result)=>{
      if(!err){
        res.json({"message": "Update was successful"});
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.put('/todoelements/updatestatus/:id/:status', (req, res)=> {
  let todo = req.body;
  let updateQuery = `update todoelements
                     set status = '${req.params.status}'
                     where id = ${req.params.id}`

  client.query(updateQuery, (err, result)=>{
      if(!err){
        res.json({"message": "update status was successful"});
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.delete('/todoelements/:id', (req, res)=> {
  let insertQuery = `delete from todoelements where id=${req.params.id}`

  client.query(insertQuery, (err, result)=>{
      if(!err){
        res.json({"message": "Deletion was successful"});
      }
      else{ console.log(err.message) }
  })
  client.end;
})

client.connect();


/*
app.get('/', (req, res) => { res.send(req.query.search) })
app.listen(3000, () => { console.log('Server is up!') })
*/