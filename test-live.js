fetch('http://127.0.0.1:5000/api/subjects')
  .then(res => res.text())
  .then(text => console.log("Response:", text))
  .catch(err => console.error("Fetch failed:", err.message));
