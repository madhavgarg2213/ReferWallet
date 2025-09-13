import { useState } from "react";
import axios from "../services/api";

export default function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/check", { password: input });
      if (res.data.success) {
        localStorage.setItem("siteAccess", "true");
        onUnlock();
      }
    } catch (err) {
      setError("Incorrect password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Password</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          placeholder="Password"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Unlock
        </button>
      </form>
    </div>
  );
}
