import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "employee",
    department: ""
  });

  const fetchEmployees = async () => {
    const res = await axios.get(`${API_BASE}/employees`);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/employees`, form);
    setForm({
      name: "",
      email: "",
      role: "employee",
      department: ""
    });
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div>
      <h2 className="page-title">Admin · Employees</h2>

      <section className="card">
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Add New Employee</h3>
        <p className="muted" style={{ marginBottom: 12 }}>
          Create employees that can be assigned performance reviews or give feedback.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Department</label>
            <input
              className="form-input"
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              Add Employee
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>Employee List</h3>
        <p className="muted">
          Use the IDs to assign reviewers on the Reviews page.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                  <td>{e.department}</td>
                  <td>
                    <button
                      className="btn btn-outline"
                      style={{ marginRight: 6 }}
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/employee/${e.id}/tasks`}
                      className="app-nav-link"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                    >
                      View Tasks
                    </Link>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted">
                    No employees yet. Add one above to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
