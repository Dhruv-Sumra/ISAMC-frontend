import React, { useState } from "react";
import api from "../utils/api"; 

const SubmitPaper = () => {
  const [form, setForm] = useState({ name: "", email: "", title: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("title", form.title);
    if (file) formData.append("paper", file);
    try {
      const res = await api.post("/paper/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message || (data.success ? "Submitted!" : "Error"));
      setForm({ name: "", email: "", title: "" });
      setFile(null);
    } catch (err) {
      setMessage("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-25 dark:bg-slate-600 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Submit Your Paper</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Paper Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="file"
          name="paper"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Paper"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default SubmitPaper; 