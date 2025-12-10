"use client";

import React from "react";

function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-200">
            Last Updated: December 5, 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-700">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p>
            Welcome to Dite Meals. By using our website or services, you agree
            to our Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Account & Eligibility</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>You must be 18+ to use our service.</li>
            <li>Provide accurate account details.</li>
            <li>Your account may be suspended if terms are violated.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Orders & Payments</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Orders may be accepted or rejected based on availability.</li>
            <li>Pricing may change anytime without notice.</li>
            <li>Secure payment is required for all orders.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Delivery</h2>
          <p>
            Delivery availability and time may vary depending on your location
            and capacity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Liability</h2>
          <p>
            We are not liable for any indirect damages. The platform is provided
            as-is.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="mb-1">
              <strong>Fittbox Dite Meals</strong>
            </p>
            <p className="mb-1">Support Team</p>
          </div>
        </section>

        <section className="bg-green-50 border-l-4 border-green-600 p-4 rounded text-sm">
          <p>
            By continuing to browse or use our platform, you accept our Terms of
            Service.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Page;
