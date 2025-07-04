import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.mobile && formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/contact/send-message", formData);
      
      if (response.data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: ""
        });
      } else {
        toast.error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 max-w-3xl mx-auto">
      <h2 className="font-semibold text-2xl md:text-4xl">Contact us
        <div className="border-2 border-blue-500 w-1/5"></div>
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="w-full md:pr-50 space-y-4 dark:text-black bg-blue-100 rounded-sm p-4 mt-4">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <label htmlFor="name" className="text-base md:text-lg">
              Name *
            </label>
            <input 
              type="text" 
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name" 
              className="w-full md:w-80 rounded-sm p-1 px-2 bg-blue-50" 
              required
            />
          </div>
          
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <label htmlFor="email" className="text-base md:text-lg">
              Email *
            </label>
            <input 
              type="email" 
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              className="w-full md:w-80 rounded-sm p-1 px-2 bg-blue-50" 
              required
            />
          </div>
          
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <label htmlFor="mobile" className="text-base md:text-lg">
              Mobile no
            </label>
            <input
              type="number"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full md:w-80 rounded-sm p-1 px-2 bg-blue-50"
              pattern="\d{10}"
              min="1000000000"
              max="9999999999"
              placeholder="Enter 10-digit number"
              onInput={(e) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />
          </div>
          
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <label htmlFor="subject" className="text-base md:text-lg">
              Subject *
            </label>
            <input 
              type="text" 
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter your subject" 
              className="w-full md:w-80 rounded-sm p-1 px-2 bg-blue-50" 
              required
            />
          </div>

          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <label htmlFor="message" className="text-base md:text-lg self-start md:self-center">
              Message *
            </label>
            <textarea 
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter any message" 
              className="w-full md:w-80 h-40 rounded-sm p-1 px-2 bg-blue-50" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 px-4 py-2 rounded-sm bg-blue-500 text-lg hover:bg-blue-600 text-white md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contactus;