import { Component } from 'react';
import { signUp } from '../../utilities/users-service';

export default class SignUpForm extends Component {
  state = {
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
    day: '',
    month: '',
    year: '',
    error: ''
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
      error: ''
    });
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { displayName, username, email, password, day, month, year } = this.state;

      // Combine day, month, and year into a single date string (YYYY-MM-DD)
      const dateOfBirth = `${year}-${month}-${day}`;

      const formData = { displayName, username, email, password, dateOfBirth };

      const user = await signUp(formData);
      this.props.setUser(user);
    } catch {
      this.setState({ error: 'Sign Up Failed - Try Again' });
    }
  };

  render() {
    const disable = this.state.password !== this.state.confirm;
    return (
      <div>
        <div className="form-container">
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <label>Email</label>
            <input type="email" name="email" value={this.state.email} onChange={this.handleChange} required />
            <label>Username</label>
            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} required />
            <label>Display Name</label>
            <input type="text" name="displayName" value={this.state.displayName} onChange={this.handleChange} required />
            <label>Password</label>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} required />
            <label>Confirm</label>
            <input type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} required />
            <label>Date of Birth</label>
            <div className="dob-container">
              <select name="day" value={this.state.day} onChange={this.handleChange} required>
                <option value="">Day</option>
                {/* Generate day options */}
                {[...Array(31).keys()].map(d => (
                  <option key={d + 1} value={d + 1}>{d + 1}</option>
                ))}
              </select>
              <select name="month" value={this.state.month} onChange={this.handleChange} required>
                <option value="">Month</option>
                {[...Array(12).keys()].map(m => (
                  <option key={m + 1} value={m + 1}>{m + 1}</option>
                ))}
              </select>
              <select name="year" value={this.state.year} onChange={this.handleChange} required>
                <option value="">Year</option>
                {/* Generate year options */}
                {[...Array(100).keys()].map(y => (
                  <option key={2024 - y} value={2024 - y}>{2024 - y}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={disable}>SIGN UP</button>
          </form>
        </div>
        <p className="error-message">&nbsp;{this.state.error}</p>
      </div>
    );
  }
}
