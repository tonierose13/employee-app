import { useEffect, useState } from "react";

const STORAGE_KEY = "employees";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveData(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());

export default function App() {
  const [employees, setEmployees] = useState(() => loadData());
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null); // null = add mode

  // persist whenever employees change
  useEffect(() => { saveData(employees); }, [employees]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // enter edit mode
  function startEdit(emp) {
    setEditingId(emp.id);
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
    });
  }

  // exit edit mode without saving
  function cancelEdit() {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "" });
  }

  // handles both Add and Update
  function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name || !email) return alert("Name and Email are required.");
    if (!isEmail(email)) return alert("Please enter a valid email address.");

    // prevent duplicate emails (ignore the record we're editing)
    const taken = employees.some(
      (emp) => emp.email?.toLowerCase() === email.toLowerCase() && emp.id !== editingId
    );
    if (taken) return alert("This email already exists.");

    if (editingId) {
      // UPDATE existing record
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingId ? { ...emp, name, email, phone } : emp
        )
      );
      cancelEdit();
    } else {
      // ADD new record
      setEmployees((prev) => [
        {
          id: Date.now(),
          name,
          email,
          phone,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setForm({ name: "", email: "", phone: "" });
    }
  }

  function removeEmployee(id) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) cancelEdit();
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    setEmployees([]);
    cancelEdit();
  }

  return (
    <div style={{ maxWidth: 760, margin: "24px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Employee Manager</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} autoComplete="on" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ margin: "12px 0" }}>
          <label style={{ display: "block" }}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            style={{ width: "100%", padding: 10 }}
            placeholder="e.g., Tonie Rose"
          />
        </div>
        <div style={{ margin: "12px 0" }}>
          <label style={{ display: "block" }}>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            style={{ width: "100%", padding: 10 }}
            placeholder="e.g., tonie@example.com"
          />
        </div>
        <div style={{ margin: "12px 0" }}>
          <label style={{ display: "block" }}>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            style={{ width: "100%", padding: 10 }}
            placeholder="e.g., 555-123-4567"
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId ? (
            <button type="button" onClick={cancelEdit}>Cancel</button>
          ) : (
            <button type="button" onClick={clearAll}>Clear All</button>
          )}
        </div>
      </form>

      {/* LIST */}
      <h2 style={{ textAlign: "center", marginTop: 24 }}>
        Employee List ({employees.length})
      </h2>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {employees.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No employees yet.</p>
        ) : (
          employees.map((e) => (
            <div key={e.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, margin: "8px 0" }}>
              <b>{e.name}</b> — {e.email} — {e.phone || "—"}
              <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(e)}>Edit</button>
                <button onClick={() => removeEmployee(e.id)}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
