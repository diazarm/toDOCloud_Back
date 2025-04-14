const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModels.js');

// Obtener todos los todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo todo
router.post('/', async (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar todo
router.put('/:id', async (req, res) => {
  try {
    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ message: 'El campo "completed" debe ser booleano' });
    }

    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo no encontrado' });

    todo.completed = req.body.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});


// Eliminar todo
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Todo.findByIdAndDelete(id);
    res.json({ message: `ID: ${id} eliminado` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;