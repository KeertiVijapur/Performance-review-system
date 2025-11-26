import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export default function EmployeeTasksPage() {
  const { employeeId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    reviewId: "",
    rating: 5,
    comments: ""
  });

  const fetchTasks = async () => {
    const res = await axios.get(`${API_BASE}/my-tasks/${employeeId}`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [employeeId]);

  const startFeedback = (reviewId) => {
    setFeedbackForm({
      reviewId,
      rating: 5,
      comments: ""
    });
  };

  const handleChange = (e) => {
    setFeedbackForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${API_BASE}/reviews/${feedbackForm.reviewId}/feedback`, {
      reviewerId: employeeId,
      rating: Number(feedbackForm.rating),
      comments: feedbackForm.comments
    });

    setFeedbackForm({
      reviewId: "",
      rating: 5,
      comments: ""
    });

    fetchTasks();
  };

  return (
    <div>
      <h2 className="page-title">
        Employee · My Feedback Tasks{" "}
        <span className="muted" style={{ fontSize: 13 }}>
          (ID: {employeeId})
        </span>
      </h2>

      <section className="card">
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Assigned Reviews</h3>
        {tasks.length === 0 ? (
          <p className="muted">You don&apos;t have any feedback tasks yet.</p>
        ) : (
          <ul className="list">
            {tasks.map((t) => (
              <li key={t.assignmentId} style={{ marginBottom: 8 }}>
                <div>
                  Give feedback for{" "}
                  <strong>{t.reviewFor}</strong>{" "}
                  <span className="muted">
                    {t.reviewForDepartment && `(${t.reviewForDepartment})`}
                  </span>{" "}
                  — Period: {t.period} —{" "}
                  {t.submitted ? (
                    <span className="chip chip-pill">Submitted</span>
                  ) : (
                    <span className="chip chip-pill-warning">Pending</span>
                  )}
                </div>
                {!t.submitted && (
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: 6 }}
                    onClick={() => startFeedback(t.reviewId)}
                  >
                    Give Feedback
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {feedbackForm.reviewId && (
        <section className="card">
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>Submit Feedback</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label className="form-label">Rating (1–5)</label>
              <input
                className="form-input"
                type="number"
                name="rating"
                min={1}
                max={5}
                value={feedbackForm.rating}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Comments</label>
              <textarea
                className="form-textarea"
                name="comments"
                rows={3}
                value={feedbackForm.comments}
                onChange={handleChange}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-primary">
                Submit Feedback
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
