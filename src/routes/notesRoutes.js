const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

/**
 * Route: /api/notes
 * - GET: Fetch all notes (supports ?search= and ?category=)
 * - POST: Create a new note
 */
router
  .route('/')
  .get(notesController.getNotes)
  .post(notesController.createNote);

/**
 * Route: /api/notes/:id
 * - GET: Fetch a single note by ID
 * - PUT: Update an existing note by ID
 * - DELETE: Delete a note by ID
 */
router
  .route('/:id')
  .get(notesController.getNoteById)
  .put(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
