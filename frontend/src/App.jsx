import { Routes, Route, Link } from "react-router-dom";
import AdminEmployeesPage from "./pages/AdminEmployeesPage.jsx";
import AdminReviewsPage from "./pages/AdminReviewsPage.jsx";
import EmployeeTasksPage from "./pages/EmployeeTasksPage.jsx";

export default function App() {
  return (
    <div className="app-root">
      <div className="app-shell">
        <header style={{ marginBottom: 14 }}>
          <h1 className="app-title">Performance Review System</h1>
          <p className="app-subtitle">
            A full-stack application to manage employees, performance reviews and feedback.
          </p>

          <nav className="app-nav">
            <Link to="/admin/employees" className="app-nav-link">
              Admin · Employees
            </Link>
            <Link to="/admin/reviews" className="app-nav-link">
              Admin · Reviews
            </Link>
            {/* demo: hard-coded "logged in" employee */}
            <Link to="/employee/e2/tasks" className="app-nav-link">
              Employee · My Tasks (e2)
            </Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<AdminEmployeesPage />} />
            <Route path="/admin/employees" element={<AdminEmployeesPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route
              path="/employee/:employeeId/tasks"
              element={<EmployeeTasksPage />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
