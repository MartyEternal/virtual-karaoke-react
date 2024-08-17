import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="w-screen flex bg-white overflow-hidden mt-1">
          <div className="w-full p-8">
            <h2 className="text-3xl font-bold flex justify-center">{showLogin ? 'Welcome back!' : 'Create an Account'}</h2>
            <p className="text-gray-600 flex justify-center">
              {showLogin ? 'Log in now to start singing!' : 'Join us and start your singing journey!'}
            </p>
            {showLogin ? <LoginForm setUser={setUser} /> : <SignUpForm setUser={setUser} />}
            <div className="flex justify-center items-center mb-1">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  {showLogin ? "Don't have an account?" : "Already have an account? Log In"}
                </button>
              </div>
              <div className="ml-4">
                {showLogin && (
                  <Link to="#" className="text-gray-500 hover:underline">Forgot your password?</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}