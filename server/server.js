const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors()); // Utilizăm cors fără opțiuni pentru a permite accesul din toate origin-urile
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

app.post("/submit_testimonial", (req, res) => {
  const { name, company, stars, description } = req.body;

  const query =
    "INSERT INTO testimonials (name, company, stars, description) VALUES (?, ?, ?, ?)";
  const values = [name, company, stars, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).send("Error saving testimonial. Please try again.");
      return;
    }
    res.send("Testimonial submitted successfully!");
  });
});

app.get("/testimonials", (req, res) => {
  const query = "SELECT * FROM testimonials";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).send("Error fetching testimonials. Please try again.");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
