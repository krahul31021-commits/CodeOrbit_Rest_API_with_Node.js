# 📝 Notes REST API with Node.js & Express

A clean, modular, and fully commented RESTful API built with **Node.js** and **Express**. It provides endpoints to add, view, update, and delete notes records using a persistent JSON storage system (no external database required).

---

## 🌟 Features

- **Full CRUD Operations**:
  - `POST /api/notes` - Add a new note (with input validation)
  - `GET /api/notes` - View all notes (supports `?search=` and `?category=` filters)
  - `GET /api/notes/:id` - View a single note by ID
  - `PUT /api/notes/:id` - Update an existing note
  - `DELETE /api/notes/:id` - Delete a note by ID
- **File-based Storage**: Data persists in `data/notes.json` with 2-space formatted JSON.
- **Input Validation & Error Handling**: Comprehensive validation for missing fields, malformed JSON, and proper HTTP status codes (`200`, `201`, `400`, `404`, `500`).
- **Multiple Testing Options**:
  1. **Postman Collection**: Ready-to-import `postman_collection.json`.
  2. **Automated Test Suite**: Built-in test runner executed via `npm test`.
  3. **Interactive Web Dashboard**: Built-in tester and console accessible at `http://localhost:3000`.
  4. **cURL / PowerShell**: Pre-configured terminal commands.

---

## 📁 Project Architecture

```
Rest_API_with_Node.js/
├── data/
│   └── notes.json              # File storage for records
├── public/
│   └── index.html              # Interactive browser dashboard & tester
├── src/
│   ├── controllers/
│   │   └── notesController.js  # Request/response logic, status codes & validation
│   ├── models/
│   │   └── notesModel.js       # File I/O operations & CRUD functions
│   ├── routes/
│   │   └── notesRoutes.js      # Express route definitions
│   └── app.js                  # Express middleware & app configuration
├── server.js                   # Application entry point & HTTP listener
├── postman_collection.json     # Postman collection v2.1 for one-click testing
├── test-api.js                 # 24-assertion automated test suite
├── package.json                # Project dependencies and npm scripts
└── README.md                   # Complete documentation
```

---

## 🚀 Quick Start

### 1. Installation

Ensure [Node.js](https://nodejs.org/) (v18+) is installed. Install dependencies:

```bash
npm install
```

### 2. Start the Server

```bash
# Standard production start:
npm start

# Or with Node.js live file-watcher:
npm run dev
```

The server will start on port `3000`:
- 🌐 **Interactive Dashboard & Docs**: [http://localhost:3000](http://localhost:3000)
- 📋 **API Endpoints**: [http://localhost:3000/api/notes](http://localhost:3000/api/notes)
- ❤️ **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

---

## 🧪 Testing the Endpoints

### Option 1: Automated Test Suite (Recommended)

Run the included automated test runner:

```bash
npm test
```

This executes 24 automated assertions covering:
- Health check validation
- Retrieving all records
- Creating new records (`201 Created`)
- Viewing single records by ID (`200 OK`)
- Updating records (`PUT`)
- Query string filtering (`?search=`)
- Deleting records (`DELETE`)
- Verifying deletion (`404 Not Found`)
- Validation error handling on missing fields (`400 Bad Request`)

---

### Option 2: Postman

1. Open **Postman**.
2. Click **Import** (top left).
3. Select or drag-and-drop the file: `postman_collection.json`.
4. The **Notes REST API** collection will appear with pre-configured requests:
   - `Server Health Check`
   - `1. Get All Notes`
   - `2. Search / Filter Notes`
   - `3. Get Note by ID`
   - `4. Create Note (POST)`
   - `5. Update Note (PUT)`
   - `6. Delete Note (DELETE)`
   - `Validation Error Test`
   - `Not Found Error Test`
5. Click **Send** on any request to test!

---

### Option 3: Interactive Browser Tester

Open [http://localhost:3000](http://localhost:3000) in your web browser:
- Create new notes with the form.
- Filter notes in real time by category or search keyword.
- Edit (PUT) or delete (DELETE) records with click-to-action buttons.
- Inspect raw HTTP requests and responses in the real-time terminal window.

---

### Option 4: cURL / Terminal Commands

#### 1. View all notes:
```bash
curl -X GET http://localhost:3000/api/notes
```

#### 2. Search notes by keyword:
```bash
curl -X GET "http://localhost:3000/api/notes?search=Express"
```

#### 3. View a single note by ID:
```bash
curl -X GET http://localhost:3000/api/notes/1
```

#### 4. Add a new note:
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Testing from terminal", "category": "Work"}'
```

#### 5. Update an existing note:
```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content body"}'
```

#### 6. Delete a note:
```bash
curl -X DELETE http://localhost:3000/api/notes/1
```

---

## 📖 API Reference

| Method | Endpoint | Description | Request Body | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check | None | `200 OK` |
| `GET` | `/api` | Overview & endpoint list | None | `200 OK` |
| `GET` | `/api/notes` | Get all notes (supports `?search=` and `?category=`) | None | `200 OK` |
| `GET` | `/api/notes/:id` | Get note by ID | None | `200 OK` / `404` |
| `POST` | `/api/notes` | Create a new note | `{ title*, content*, category }` | `201 Created` / `400` |
| `PUT` | `/api/notes/:id` | Update note by ID | `{ title, content, category }` | `200 OK` / `404` |
| `DELETE`| `/api/notes/:id` | Delete note by ID | None | `200 OK` / `404` |

### JSON Record Schema

```json
{
  "id": "1",
  "title": "Learn Express Middleware",
  "content": "Explore how middleware works in Node.js",
  "category": "Learning",
  "createdAt": "2026-10-30T11:30:00.000Z",
  "updatedAt": "2026-10-30T11:30:00.000Z"
}
```
