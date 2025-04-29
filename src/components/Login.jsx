import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import appFirebase from "../firebase";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const auth = getAuth(appFirebase);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md shadow-[#A0A0A0]">
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Castillo IT" className="h-26 mb-3" />
          <h2 className="text-2xl font-semibold text-[#1A2A6C]">Castillo IT</h2>
        </div>

        <h2 className="text-center text-xl font-bold text-[#1A2A6C] mb-6">| LOGIN</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-left">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A6C]"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col relative">
            <label className="text-gray-700 font-medium mb-1 text-left">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A6C]"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A2A6C] text-white p-3 rounded-lg font-semibold text-lg hover:bg-[#16235A] transition"
          >
            SIGN IN
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            Forgot your password?{" "}
            <a href="#" className="text-[#0057FF] font-medium hover:underline">
              Reset Password
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

