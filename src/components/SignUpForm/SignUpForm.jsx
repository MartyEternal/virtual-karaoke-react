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
      const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

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
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg">
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={this.state.displayName}
                onChange={this.handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={this.state.confirm}
                onChange={this.handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Date of Birth</label>
              <div className="flex space-x-2">
                <select
                  name="day"
                  value={this.state.day}
                  onChange={this.handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Day</option>
                  {[...Array(31).keys()].map(d => (
                    <option key={d + 1} value={d + 1}>{d + 1}</option>
                  ))}
                </select>
                <select
                  name="month"
                  value={this.state.month}
                  onChange={this.handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Month</option>
                  {[...Array(12).keys()].map(m => (
                    <option key={m + 1} value={m + 1}>{m + 1}</option>
                  ))}
                </select>
                <select
                  name="year"
                  value={this.state.year}
                  onChange={this.handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Year</option>
                  {[...Array(100).keys()].map(y => (
                    <option key={2024 - y} value={2024 - y}>{2024 - y}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={disable}
              className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${disable ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              SIGN UP
            </button>
          </form>
          {this.state.error && <p className="mt-4 text-red-500 text-center">{this.state.error}</p>}
        </div>
      </div>
    );
  }
}
