import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export default function AdminReviewsPage() {
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    period: "",
    content: "",
    reviewerIds: ""
  });

  const fetchEmployees = async () => {
    const res = await axios.get(`${API_BASE}/employees`);
    setEmployees(res.data);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`${API_BASE}/reviews`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewRes = await axios.post(`${API_BASE}/reviews`, {
      employeeId: form.employeeId,
      period: form.period,
      content: form.content
    });

    const newReview = reviewRes.data;

    const trimmed = form.reviewerIds.trim();
    if (trimmed.length > 0) {
      const reviewerIds = trimmed
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");

      if (reviewerIds.length > 0) {
        await axios.post(`${API_BASE}/reviews/${newReview.id}/assign`, {
          reviewerIds
        });
      }
    }

    setForm({
      employeeId: "",
      period: "",
      content: "",
      reviewerIds: ""
    });

    fetchReviews();
  };

  return (
    <div>
      <h2 className="page-title">Admin · Reviews</h2>

      <section className="card">
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>
          Create Performance Review
        </h3>
        <p className="muted" style={{ marginBottom: 12 }}>
          Pick an employee, define the review period, then assign colleagues to
          give feedback.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select employee --</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.department || "No dept"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Period</label>
            <input
              className="form-input"
              name="period"
              placeholder="Q1 2025"
              value={form.period}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Review Content</label>
            <textarea
              className="form-textarea"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Reviewer IDs{" "}
              <span className="muted">(comma separated, e.g. e2,e3)</span>
            </label>
            <input
              className="form-input"
              name="reviewerIds"
              placeholder="e2,e3"
              value={form.reviewerIds}
              onChange={handleChange}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              Create Review &amp; Assign
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>All Reviews</h3>
        <p className="muted">
          Track each review&apos;s status from draft to completed.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Status</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.employeeName}</td>
                  <td>{r.period}</td>
                  <td>
                    {r.status === "completed" ? (
                      <span className="chip chip-pill">Completed</span>
                    ) : (
                      <span className="chip chip-pill-warning">
                        {r.status}
                      </span>
                    )}
                  </td>
                  <td>{r.content}</td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    No reviews yet. Create one above to get started.
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
