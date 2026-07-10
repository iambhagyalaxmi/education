fetch('http://127.0.0.1:5000/api/subjects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseId: 'e76e3169-6afd-4d3f-a2ac-822ed10cbaa8', // Valid UUID from GET
    code: 'TEST2',
    name: 'Test 2',
    semester: 2,
    credits: 3,
    type: 'core'
  })
})
.then(res => res.text())
.then(text => console.log("Response:", text))
.catch(err => console.error("Fetch failed:", err.message));
