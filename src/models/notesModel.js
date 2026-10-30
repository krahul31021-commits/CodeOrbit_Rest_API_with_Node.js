const fs = require('fs');
const path = require('path');

// Absolute path to the JSON storage file
const DATA_FILE_PATH = path.join(__dirname, '../../data/notes.json');

/**
 * Helper function to read notes from the JSON file.
 * Returns an array of note objects.
 */
function readNotesFromFile() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // If file doesn't exist yet, return an empty array
      return [];
    }
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading notes from file:', error.message);
    return [];
  }
}

/**
 * Helper function to write notes to the JSON file.
 * Formats JSON with 2-space indentation for easy human readability.
 */
function writeNotesToFile(notes) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(notes, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing notes to file:', error.message);
    return false;
  }
}

/**
 * Retrieve all notes with optional query filtering
 * @param {Object} options - Search and category filter options
 * @returns {Array} List of notes matching criteria
 */
function getAllNotes({ search, category } = {}) {
  let notes = readNotesFromFile();

  // Filter by category if specified (case-insensitive)
  if (category) {
    notes = notes.filter(
      (n) => n.category && n.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search term across title and content
  if (search) {
    const term = search.toLowerCase();
    notes = notes.filter(
      (n) =>
        (n.title && n.title.toLowerCase().includes(term)) ||
        (n.content && n.content.toLowerCase().includes(term))
    );
  }

  return notes;
}

/**
 * Retrieve a single note by its unique ID
 * @param {string} id - Note ID
 * @returns {Object|null} Note object or null if not found
 */
function getNoteById(id) {
  const notes = readNotesFromFile();
  return notes.find((n) => String(n.id) === String(id)) || null;
}

/**
 * Create and persist a new note
 * @param {Object} data - { title, content, category }
 * @returns {Object} Newly created note record
 */
function createNote({ title, content, category = 'General' }) {
  const notes = readNotesFromFile();

  // Generate a simple unique ID (timestamp + random suffix)
  const newId = Date.now().toString();
  const now = new Date().toISOString();

  const newNote = {
    id: newId,
    title: title.trim(),
    content: content.trim(),
    category: category.trim(),
    createdAt: now,
    updatedAt: now
  };

  notes.unshift(newNote); // Add to the top of the list
  writeNotesToFile(notes);

  return newNote;
}

/**
 * Update an existing note by ID
 * @param {string} id - Note ID
 * @param {Object} updates - { title, content, category }
 * @returns {Object|null} Updated note or null if not found
 */
function updateNote(id, { title, content, category }) {
  const notes = readNotesFromFile();
  const index = notes.findIndex((n) => String(n.id) === String(id));

  if (index === -1) {
    return null; // Note not found
  }

  const existingNote = notes[index];
  const updatedNote = {
    ...existingNote,
    title: title !== undefined ? title.trim() : existingNote.title,
    content: content !== undefined ? content.trim() : existingNote.content,
    category: category !== undefined ? category.trim() : existingNote.category,
    updatedAt: new Date().toISOString()
  };

  notes[index] = updatedNote;
  writeNotesToFile(notes);

  return updatedNote;
}

/**
 * Delete a note by its ID
 * @param {string} id - Note ID
 * @returns {Object|null} The deleted note or null if not found
 */
function deleteNote(id) {
  const notes = readNotesFromFile();
  const index = notes.findIndex((n) => String(n.id) === String(id));

  if (index === -1) {
    return null; // Note not found
  }

  const [deletedNote] = notes.splice(index, 1);
  writeNotesToFile(notes);

  return deletedNote;
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
