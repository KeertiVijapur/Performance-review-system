# Performance Review System

A Simple full-stack web application designed to manage employee performance reviews. This system allows administrators to manage employees, create performance reviews, and assign reviewers, while employees can view their assigned tasks and submit feedback.

---

## Features

### Admin Module

* Add, view and delete employees
* Create performance reviews
* Assign multiple reviewers to a review
* Track review status (Pending / In Review / Completed)

### Employee Module

* View assigned feedback tasks
* Submit ratings and comments
* Automatically updates review status when all feedback is submitted

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Custom CSS (modern dark UI)

### Backend

* Node.js
* Express.js
* In-memory data storage

---

## Flow

1. Admin creates a performance review
2. Assigns reviewer IDs (e2, e3 etc.)
3. Reviewer logs in via URL
4. Views assigned tasks
5. Submits feedback
6. Review status updates to Completed

---

## Notes

* Authentication is simulated via employee ID in URL
* Data is stored in-memory (resets on server restart)
* Designed for demonstration and evaluation purposes

---

## Implementions

* Employee CRUD operations
* Performance review creation
* Reviewer assignment system
* Feedback submission flow
* Review status tracking
* Clean and responsive UI