const express = require("express");
const app = express();
app.use(express.json());

// In-memory data store
let students = [
  { id: 1, name: "Asha Sharma", course: "MCA", marks: 88 },
  { id: 2, name: "Ravi Kumar", course: "BCA", marks: 91 },
];
let nextId = 3;

const findStudent = (id) => students.find((s) => s.id === Number(id));

// READ all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// READ one student
app.get("/api/students/:id", (req, res) => {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// CREATE a student
app.post("/api/students", (req, res) => {
  const { name, course, marks } = req.body || {};
  if (!name || !course || marks === undefined) {
    return res
      .status(400)
      .json({ message: "name, course and marks are required" });
  }
  const student = { id: nextId++, name, course, marks };
  students.push(student);
  res.status(201).json(student);
});

// UPDATE a student
app.put("/api/students/:id", (req, res) => {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const { name, course, marks } = req.body || {};
  if (name !== undefined) student.name = name;
  if (course !== undefined) student.course = course;
  if (marks !== undefined) student.marks = marks;
  res.json(student);
});

// DELETE a student
app.delete("/api/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1)
    return res.status(404).json({ message: "Student not found" });

  const [removed] = students.splice(index, 1);
  res.json({ message: "Student deleted", student: removed });
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));
