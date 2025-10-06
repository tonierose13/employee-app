import React from "react";
import "./EmployeeForm.css";

class EmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      employees: []
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone } = this.state;
    if (!name.trim() || !email.trim()) return; // tiny guard

    this.setState((prev) => ({
      employees: [...prev.employees, { name, email, phone }],
      name: "",
      email: "",
      phone: ""
    }));
  };

  render() {
    const { name, email, phone, employees } = this.state;

    return (
      <div className="employee-page">
        <h2>Add Employee</h2>

        <form className="employee-form" onSubmit={this.handleSubmit}>
          <label className="row">
            <span>Name:</span>
            <input
              name="name"
              value={name}
              onChange={this.handleChange}
              required
            />
          </label>

          <label className="row">
            <span>Email:</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </label>

          <label className="row">
            <span>Phone:</span>
            <input
              name="phone"
              value={phone}
              onChange={this.handleChange}
              placeholder=""
            />
          </label>

          <button type="submit" className="primary">Add</button>
        </form>

        <h2>Employee List</h2>
        <ul className="employee-list">
          {employees.map((emp, i) => (
            <li key={i}>
              <strong>{emp.name}</strong> — {emp.email}
              {emp.phone ? ` — ${emp.phone}` : ""}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default EmployeeForm;
