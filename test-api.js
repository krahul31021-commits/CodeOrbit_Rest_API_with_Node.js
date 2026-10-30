/**
 * Automated REST API Test Suite for Notes API
 * Uses native fetch (available in Node.js 18+) to test all CRUD endpoints.
 * Can be run directly via: npm test
 */

const app = require('./src/app');

const TEST_PORT = 3456;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let server;
let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '- ' + details : ''}`);
    failedCount++;
  }
}

async function runTests() {
  console.log('\n🧪 Starting Notes REST API Test Suite...\n' + '='.repeat(50));

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      resolve();
    });
  });

  try {
    // ----------------------------------------------------
    // Test 1: GET /health
    // ----------------------------------------------------
    console.log('\n[1] Health Check');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /health returns 200 OK');
    assert(healthData.status === 'ok', 'Health status is "ok"');

    // ----------------------------------------------------
    // Test 2: GET /api/notes (View all notes)
    // ----------------------------------------------------
    console.log('\n[2] GET /api/notes (View all records)');
    const getAllRes = await fetch(`${BASE_URL}/api/notes`);
    const getAllData = await getAllRes.json();
    assert(getAllRes.status === 200, 'GET /api/notes returns 200 OK');
    assert(getAllData.success === true, 'Response success is true');
    assert(Array.isArray(getAllData.data), 'Response data is an array');
    assert(getAllData.data.length >= 1, `Found ${getAllData.data.length} existing notes`);

    // ----------------------------------------------------
    // Test 3: POST /api/notes (Add new note)
    // ----------------------------------------------------
    console.log('\n[3] POST /api/notes (Create new record)');
    const newNotePayload = {
      title: 'Automated Test Note',
      content: 'This note was created during the automated test suite run.',
      category: 'Automated-Test'
    };
    const createRes = await fetch(`${BASE_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotePayload)
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, 'POST /api/notes returns 201 Created');
    assert(createData.success === true, 'Response success is true');
    assert(createData.data && createData.data.id, 'New note has an ID generated');
    assert(createData.data.title === newNotePayload.title, 'Created note title matches payload');

    const createdNoteId = createData.data ? createData.data.id : null;

    // ----------------------------------------------------
    // Test 4: GET /api/notes/:id (View single note by ID)
    // ----------------------------------------------------
    console.log('\n[4] GET /api/notes/:id (View single record)');
    if (createdNoteId) {
      const getOneRes = await fetch(`${BASE_URL}/api/notes/${createdNoteId}`);
      const getOneData = await getOneRes.json();
      assert(getOneRes.status === 200, 'GET /api/notes/:id returns 200 OK');
      assert(getOneData.data.id === createdNoteId, 'Retrieved note ID matches requested ID');
      assert(getOneData.data.category === 'Automated-Test', 'Retrieved note category matches');
    }

    // ----------------------------------------------------
    // Test 5: PUT /api/notes/:id (Update note)
    // ----------------------------------------------------
    console.log('\n[5] PUT /api/notes/:id (Update record)');
    if (createdNoteId) {
      const updatePayload = {
        title: 'Updated Test Note Title',
        content: 'Updated content body after PUT request.',
        category: 'Updated-Category'
      };
      const updateRes = await fetch(`${BASE_URL}/api/notes/${createdNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const updateData = await updateRes.json();
      assert(updateRes.status === 200, 'PUT /api/notes/:id returns 200 OK');
      assert(updateData.data.title === updatePayload.title, 'Updated title matches new title');
      assert(updateData.data.category === updatePayload.category, 'Updated category matches new category');
    }

    // ----------------------------------------------------
    // Test 6: Query Filter (GET /api/notes?search=...)
    // ----------------------------------------------------
    console.log('\n[6] GET /api/notes?search=... (Search filter)');
    const searchRes = await fetch(`${BASE_URL}/api/notes?search=Updated`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200, 'Search query returns 200 OK');
    assert(
      searchData.data.some((n) => n.id === createdNoteId),
      'Search results include the updated note'
    );

    // ----------------------------------------------------
    // Test 7: DELETE /api/notes/:id (Delete note)
    // ----------------------------------------------------
    console.log('\n[7] DELETE /api/notes/:id (Delete record)');
    if (createdNoteId) {
      const deleteRes = await fetch(`${BASE_URL}/api/notes/${createdNoteId}`, {
        method: 'DELETE'
      });
      const deleteData = await deleteRes.json();
      assert(deleteRes.status === 200, 'DELETE /api/notes/:id returns 200 OK');
      assert(deleteData.success === true, 'Delete response reports success');

      // Verify that fetching the deleted note now returns 404
      const getDeletedRes = await fetch(`${BASE_URL}/api/notes/${createdNoteId}`);
      assert(getDeletedRes.status === 404, 'GET deleted note returns 404 Not Found');
    }

    // ----------------------------------------------------
    // Test 8: Validation Error Handling
    // ----------------------------------------------------
    console.log('\n[8] Validation Error Handling (POST with missing required fields)');
    const invalidRes = await fetch(`${BASE_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Incomplete' }) // missing title & content
    });
    const invalidData = await invalidRes.json();
    assert(invalidRes.status === 400, 'POST without title returns 400 Bad Request');
    assert(invalidData.success === false, 'Validation response indicates success=false');

    // ----------------------------------------------------
    // Test 9: 404 Route Not Found
    // ----------------------------------------------------
    console.log('\n[9] Non-existent Route Handling');
    const notFoundRes = await fetch(`${BASE_URL}/api/unknown-endpoint`);
    assert(notFoundRes.status === 404, 'Unknown endpoint returns 404 Not Found');

  } catch (err) {
    console.error('Test execution error:', err);
    failedCount++;
  } finally {
    // Close server
    await new Promise((resolve) => server.close(resolve));
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${passedCount} Passed, ${failedCount} Failed`);
    console.log('='.repeat(50) + '\n');

    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();
