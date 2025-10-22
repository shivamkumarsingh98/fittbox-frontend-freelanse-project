"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Contact page with advanced UI
// - Comprehensive contact form with validation
// - Web-sourced images for visual appeal
// - Tailwind CSS for styling
// - Framer Motion for animations (fade, slide, scale)
// - Sections: hero, contact info, form, map, FAQ

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiry: "general",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState({});

  // Web images from search
  const heroImage = "https://cdn-icons-png.freepik.com/512/10845/10845567.png";
  const galleryImages = [
    "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528",
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?cs=srgb&dl=pexels-ella-olsson-1640777.jpg&fm=jpg",
    "https://www.naturemade.com/cdn/shop/articles/healthy-foods-to-eat_960x.jpg?v=1611988563",
  ];

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      newErrors.phone = "Valid 10-digit phone number is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        inquiry: "general",
      });
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const toggleFaq = (idx) => setFaqOpen((s) => ({ ...s, [idx]: !s[idx] }));

  const faqs = [
    {
      q: "How quickly will I get a response?",
      a: "Our team typically responds within 24 hours.",
    },
    {
      q: "Can I schedule a call?",
      a: "Yes, use the premium consultation option for instant scheduling.",
    },
    {
      q: "Is my information secure?",
      a: "We use industry-standard encryption to protect your data.",
    },
    {
      q: "What are your support hours?",
      a: "We’re available 9 AM to 6 PM IST, Monday to Saturday.",
    },
  ];

  return (
    <main className="py-12 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-blue-10 to-green-50 min-h-screen font-sans">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-2 gap-12 items-center mb-16 px-6 md:px-12"
      >
        {/* Text Section */}
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
            Connect with our{" "}
            <span className="text-red-600 font-semibold">
              nutrition experts
            </span>{" "}
            for personalized advice. Fill out the form, explore our contact
            options, or book a premium consultation for in-depth guidance.
          </p>

          {/* Example Highlight Boxes (optional) */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100"
      >
        <div className="text-sm text-gray-500">Fast Response</div>
        <div className="font-bold text-red-600">24/7 Support</div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100"
      >
        <div className="text-sm text-gray-500">Expert Team</div>
        <div className="font-bold text-red-600">Certified Nutritionists</div>
      </motion.div>
    </div> */}
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className=" overflow-hidden  transition-shadow duration-300"
        >
          <img
            src={heroImage}
            alt="Contact Hero"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </motion.section>

      {/* Contact Info Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Our Contact Channels
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-md text-center"
          >
            <svg
              className="h-12 w-12 mx-auto mb-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600">support@nutritionhub.com</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-md text-center"
          >
            <svg
              className="h-12 w-12 mx-auto mb-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600">+91-123-456-7890</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-md text-center"
          >
            <svg
              className="h-12 w-12 mx-auto mb-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-600">123 Health St, Mumbai, India</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Nutrition Inspiration
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {galleryImages.map((src, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="rounded-2xl overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={src}
                alt={`Inspiration ${i + 1}`}
                className="w-full h-64 object-cover"
              />
            </motion.figure>
          ))}
        </div>
      </motion.section>

      {/* Contact Form & Premium Consultation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid lg:grid-cols-3 gap-12 mb-16"
      >
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Send Us a Message
            </h2>
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl"
                >
                  Thank you! Your message has been sent.
                </motion.div>
              )}
            </AnimatePresence>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`p-4 rounded-xl border w-full ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`p-4 rounded-xl border w-full ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`p-4 rounded-xl border w-full ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <select
                  name="inquiry"
                  value={form.inquiry}
                  onChange={handleChange}
                  className="p-4 rounded-xl border w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="general">General Inquiry</option>
                  <option value="nutrition">Nutrition Consultation</option>
                  <option value="billing">Billing Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  className={`p-4 rounded-xl border w-full ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold shadow-lg w-full md:w-auto"
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <aside>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-tr from-purple-700 to-pink-600 text-white rounded-3xl shadow-2xl p-8 sticky top-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                />
              </svg>
              <div>
                <div className="text-2xl font-bold">Premium Consultation</div>
                <div className="text-sm opacity-90">
                  Speak to a Nutritionist
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold">₹299</div>
              <div className="text-sm opacity-90">/ 20-min session</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-full bg-white text-purple-700 font-bold shadow-lg"
            >
              Book Now
            </motion.button>
            <p className="text-sm opacity-90 text-center mt-4">
              Secure payments · Instant scheduling · Certified professionals
            </p>
          </motion.div>
        </aside>
      </motion.section>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Find Us
        </h2>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.989304225735!2d72.83411731469066!3d19.06405828709192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306649c7d3%3A0x3f2e2d01a31d4347!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1697648923456!5m2!1sen!2sus"
            className="w-full h-full"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md"
          >
            <p className="font-semibold">Nutrition Hub</p>
            <p className="text-gray-600">123 Health St, Mumbai, India</p>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 flex justify-between items-center text-left font-semibold text-gray-800"
              >
                {faq.q}
                <motion.span
                  animate={{ rotate: faqOpen[idx] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {faqOpen[idx] && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 pt-0 text-gray-600 border-t"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
};

export default Page;
