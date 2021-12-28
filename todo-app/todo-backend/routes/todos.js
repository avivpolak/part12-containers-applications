const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const singleRouter = express.Router();
const redis = require('../redis')
/* POST todo to listing. */
router.get('/statistics', async (req, res) => {
  const todos = await Todo.find({})
  await redis.setAsync("added_todos",todos.length)
  const numOfTodos = await redis.getAsync("added_todos")
  res.json({"added_todos":numOfTodos});
});

/* GET todo. */
router.get('/:id', async (req, res) => { 
  const { id } = req.params
  const todo = await Todo.findById(id)
  if (!todo) return res.sendStatus(404)
  res.send(todo); // Implement this
});

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todos = await Todo.find({})
  res.send(todo);
});



/* PUT todo. */
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const {text ,done}=req.body
  let response
  if (text!==undefined){
    response = await Todo.findByIdAndUpdate(id,{text})
   console.log("text updateted",response)
  }
  if (done!==undefined){
    console.log(done)
     response = await Todo.findByIdAndUpdate(id,{done})
    console.log("done updateted",response)
  }
  
  res.send(response); // Implement this
});


const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
console.log(req.todo)
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});



/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

//router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
