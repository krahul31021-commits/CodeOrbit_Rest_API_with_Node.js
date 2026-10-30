const notesModel = require('../models/notesModel');

/**
 * @desc   Get all notes (with optional ?search= and ?category= query params)
 * @route  GET /api/notes
 * @access Public
 */
exports.getNotes = (req, res) => {
  try {
    const { search, category } = req.query;
    const notes = notesModel.getAllNotes({ search, category });

    return res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch notes'
    });
  }
};

/**
 * @desc   Get a single note by ID
 * @route  GET /api/notes/:id
 * @access Public
 */
exports.getNoteById = (req, res) => {
  try {
    const { id } = req.params;
    const note = notesModel.getNoteById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note with id '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch note'
    });
  }
};

/**
 * @desc   Create a new note
 * @route  POST /api/notes
 * @access Public
 */
exports.createNote = (req, res) => {
  try {
    const { title, content, category } = req.body;

    // --- Validation ---
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'title' is required and must not be empty"
      });
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'content' is required and must not be empty"
      });
    }

    const newNote = notesModel.createNote({
      title,
      content,
      category: category || 'General'
    });

    // 201 Created indicates successful resource creation
    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Unable to create note'
    });
  }
};

/**
 * @desc   Update an existing note
 * @route  PUT /api/notes/:id
 * @access Public
 */
exports.updateNote = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    // Validate that at least one field is provided to update
    if (title === undefined && content === undefined && category === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Please provide at least one field to update (title, content, or category)'
      });
    }

    // Check if title or content are provided as empty strings
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'title' cannot be empty"
      });
    }

    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'content' cannot be empty"
      });
    }

    const updatedNote = notesModel.updateNote(id, { title, content, category });

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        error: `Note with id '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update note'
    });
  }
};

/**
 * @desc   Delete a note by ID
 * @route  DELETE /api/notes/:id
 * @access Public
 */
exports.deleteNote = (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = notesModel.deleteNote(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        error: `Note with id '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Unable to delete note'
    });
  }
};
