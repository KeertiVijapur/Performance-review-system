const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ------------ IN-MEMORY "DATABASE" ------------

let employees = [
  {
    id: "e1",
    name: "Sanjay Sharma",
    email: "sanjay.rao@cyseck.com",
    role: "admin",
    department: "Human Resources"
  },
  {
    id: "e2",
    name: "Keerti Vijapur",
    email: "keerti.vijapur@cyseck.com",
    role: "employee",
    department: "Software Development"
  },
  {
    id: "e3",
    name: "Abc Xyz",
    email: "abc.xyz@cyseck.com",
    role: "employee",
    department: "Quality Assurance"
  }
];

let employeeCounter = employees.length + 1; // next -> e3

let reviews = [];       // performance reviews
let assignments = [];   // who must give feedback for which review
let feedbacks = [];     // feedback submitted

let reviewCounter = 1;
let assignmentCounter = 1;
let feedbackCounter = 1;

// ------------ EMPLOYEE ENDPOINTS (ADMIN) ------------

// GET all employees
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

// CREATE employee
app.post("/api/employees", (req, res) => {
  const { name, email, role = "employee", department } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newEmployee = {
    id: "e" + employeeCounter,
    name,
    email,
    role,
    department
  };

  employeeCounter++;

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// UPDATE employee
app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role, department } = req.body;

  const employee = employees.find((e) => e.id === id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  if (name !== undefined) employee.name = name;
  if (email !== undefined) employee.email = email;
  if (role !== undefined) employee.role = role;
  if (department !== undefined) employee.department = department;

  res.json(employee);
});

// DELETE employee
app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees.splice(index, 1);
  res.status(204).send();
});

// ------------ PERFORMANCE REVIEW ENDPOINTS (ADMIN) ------------

// GET all reviews
app.get("/api/reviews", (req, res) => {
  const result = reviews.map((r) => {
    const employee = employees.find((e) => e.id === r.employeeId);
    return {
      ...r,
      employeeName: employee ? employee.name : "Unknown"
    };
  });
  res.json(result);
});

// CREATE review
app.post("/api/reviews", (req, res) => {
  const { employeeId, period, content } = req.body;

  if (!employeeId || !period || !content) {
    return res
      .status(400)
      .json({ message: "employeeId, period and content are required" });
  }

  const newReview = {
    id: "r" + reviewCounter,
    employeeId,
    period,
    content,
    status: "pending"
  };

  reviewCounter++;

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// ASSIGN reviewers to a review
app.post("/api/reviews/:id/assign", (req, res) => {
  const { id: reviewId } = req.params;
  const { reviewerIds } = req.body;

  console.log("ASSIGN CALLED");
  console.log("Received reviewerIds:", reviewerIds);

  if (!Array.isArray(reviewerIds) || reviewerIds.length === 0) {
    return res
      .status(400)
      .json({ message: "reviewerIds must be a non-empty array" });
  }

  const review = reviews.find((r) => r.id === reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const newAssignments = reviewerIds.map((rid) => {
    console.log("Assigning to reviewer:", rid);

    return {
      id: "a" + assignmentCounter++,
      reviewId,
      reviewerId: rid,
      submitted: false
    };
  });

  assignments.push(...newAssignments);
  review.status = "in_review";

  console.log("CURRENT ASSIGNMENTS:", assignments);

  res.status(201).json(newAssignments);
});

// ------------ EMPLOYEE TASKS & FEEDBACK ------------

// Get tasks for one employee
app.get("/api/my-tasks/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  console.log("my-tasks called for:", employeeId);
  console.log("Current assignments:", assignments);

  const myAssignments = assignments.filter(
    (a) => a.reviewerId === employeeId
  );

  const tasks = myAssignments.map((a) => {
    const review = reviews.find((r) => r.id === a.reviewId);
    const employee = employees.find((e) => e.id === review.employeeId);

    return {
      assignmentId: a.id,
      submitted: a.submitted,
      reviewId: review.id,
      period: review.period,
      reviewFor: employee?.name ?? "Unknown",
      reviewForDepartment: employee?.department ?? "Unknown"
    };
  });

  res.json(tasks);
});

// DEBUG: see all assignments directly
app.get("/api/debug/assignments", (req, res) => {
  res.json(assignments);
});

// Submit feedback for a review
app.post("/api/reviews/:id/feedback", (req, res) => {
  const { id: reviewId } = req.params;
  const { reviewerId, rating, comments } = req.body;

  if (!reviewerId || rating === undefined) {
    return res
      .status(400)
      .json({ message: "reviewerId and rating are required" });
  }

  const review = reviews.find((r) => r.id === reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const assignment = assignments.find(
    (a) => a.reviewId === reviewId && a.reviewerId === reviewerId
  );

  if (!assignment) {
    return res
      .status(400)
      .json({ message: "Reviewer is not assigned to this review" });
  }

  const newFeedback = {
    id: "f" + feedbackCounter++,
    reviewId,
    reviewerId,
    rating,
    comments: comments || ""
  };

  feedbacks.push(newFeedback);
  assignment.submitted = true;

  const remaining = assignments.filter(
    (a) => a.reviewId === reviewId && !a.submitted
  );
  if (remaining.length === 0) {
    review.status = "completed";
  }

  res.status(201).json(newFeedback);
});

// ------------ START SERVER ------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});