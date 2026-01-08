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
            Last Updated: December 30, 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12 text-gray-800">
        {/* Privacy Policy */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Terms of Service for FITTBOX
          </h2>

          <h3 className="font-semibold mt-4">1. Introduction</h3>
          <p>
            Welcome to Fittbox. We respect your privacy and are committed to
            protecting your personal data when you use our website/app and meal
            subscription services in South Bangalore.
          </p>

          <h3 className="font-semibold mt-4">2. Information We Collect</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Personal Identity:</strong> Name, Phone Number, Email
              Address
            </li>
            <li>
              <strong>Delivery Details:</strong> Address, Landmark, Delivery
              Instructions
            </li>
            <li>
              <strong>Health & Dietary Data:</strong> Allergies, food
              preferences, health goals, caloric requirements (Sensitive Data)
            </li>
            <li>
              <strong>Payment Information:</strong> Transaction IDs only. Card
              details are handled securely by payment gateways like Razorpay /
              PhonePe
            </li>
          </ul>

          <h3 className="font-semibold mt-4">3. How We Use Your Information</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>To prepare and deliver meals</li>
            <li>To personalize meals based on your goals and allergies</li>
            <li>To send delivery updates and reminders</li>
            <li>To improve menu quality and services</li>
          </ul>

          <h3 className="font-semibold mt-4">4. Data Sharing</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Delivery partners (Dunzo, Porter, internal fleet)</li>
            <li>Payment gateways and IT service providers</li>
            <li>Legal authorities if required by law or FSSAI</li>
          </ul>

          <h3 className="font-semibold mt-4">5. Cookies</h3>
          <p>
            We use cookies to remember login sessions and dietary preferences
            for a better user experience.
          </p>

          <h3 className="font-semibold mt-4">6. Your Rights</h3>
          <p>
            You may request to review, update, or delete your data by contacting
            our Grievance Officer at <strong>fittbox4all@gmail.com</strong>.
          </p>
        </section>

        {/* Terms of Service */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>

          <h3 className="font-semibold mt-4">1. Acceptance of Terms</h3>
          <p>
            By subscribing to Fittbox meal plans, you agree to these Terms of
            Service.
          </p>

          <h3 className="font-semibold mt-4">2. Service Area</h3>
          <p>
            We currently operate only in South Bangalore (Banashankari,
            Jayanagar, JP Nagar, Kanakapura Road, Bannerghatta Road, RR Nagar,
            BTM Layout).
          </p>

          <h3 className="font-semibold mt-4">3. Subscriptions & Pause</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>All meal plans are prepaid (Weekly / Monthly)</li>
            <li>Menu items may change based on availability</li>
            <li>
              Pause requests must be made before <strong>8:00 PM</strong> the
              previous day
            </li>
          </ul>

          <h3 className="font-semibold mt-4">4. Cancellation & Refunds</h3>
          <p>
            Refunds are processed after deducting a 20% cancellation fee and the
            cost of meals already delivered. Refunds take 5–7 business days.
          </p>

          <h3 className="font-semibold mt-4">5. Delivery Policy</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Breakfast: 8:00 – 9:30 AM</li>
            <li>Lunch: 12:30 – 2:00 PM</li>
            <li>Dinner: 7:00 – 9:00 PM</li>
          </ul>

          <h3 className="font-semibold mt-4">6. Health Disclaimer</h3>
          <p>
            Our meals are not medical advice. Please consult a doctor before
            starting any strict diet plan.
          </p>

          <h3 className="font-semibold mt-4">7. Food Safety</h3>
          <p>
            Meals must be consumed within 4 hours of delivery. No returns are
            accepted due to the perishable nature of food.
          </p>

          <h3 className="font-semibold mt-4">8. Governing Law</h3>
          <p>
            These terms are governed by the laws of India. Jurisdiction:
            Bengaluru, Karnataka.
          </p>
        </section>

        {/* Footer Info */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <p>
            <strong>FSSAI License No:</strong> 21225186000334
          </p>
          <p className="mt-2">
            <strong>Grievance Officer:</strong> Yogesh K
          </p>
          <p className="mt-2">
            #3, FittBox, 5th Floor, Kanakapura Main Rd, Raghuvanahalli,
            Bengaluru 560109
          </p>
          <p className="mt-2">
            Email: <strong>fittbox4all@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Page;
