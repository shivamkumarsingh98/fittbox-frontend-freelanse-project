"use client";

import React from "react";

function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-green-100">
            Last Updated: December 5, 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Dite Meals ("Company," "we," "us," "our," or
              "Service"). We are committed to protecting your privacy and
              ensuring you have a positive experience on our platform. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website and use our
              services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.1 Personal Information You Provide
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Account information (name, email, phone number, password)
                  </li>
                  <li>Delivery address and billing information</li>
                  <li>Payment details and transaction history</li>
                  <li>Profile information and preferences</li>
                  <li>
                    Communication history and customer service interactions
                  </li>
                  <li>Feedback, reviews, and ratings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>Cookies and tracking technologies</li>
                  <li>Usage data and analytics</li>
                  <li>Location data (with your permission)</li>
                  <li>Log files and access history</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.3 Third-Party Information
                </h3>
                <p className="text-gray-700">
                  We may receive information about you from third parties
                  including payment processors, delivery partners, and analytics
                  providers.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect for various purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To process orders and deliver meals to you</li>
              <li>To manage your account and provide customer support</li>
              <li>To process payments and prevent fraud</li>
              <li>To send promotional emails and marketing communications</li>
              <li>To improve our services and website functionality</li>
              <li>To analyze usage patterns and conduct market research</li>
              <li>To comply with legal obligations and enforce agreements</li>
              <li>To personalize your experience and recommendations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. How We Share Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information with:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.1 Service Providers
                </h3>
                <p className="text-gray-700">
                  Payment processors, delivery partners, hosting providers, and
                  email services that assist us in operating our website and
                  conducting our business.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.2 Business Partners
                </h3>
                <p className="text-gray-700">
                  Marketing partners and affiliated businesses with your
                  consent.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.3 Legal Requirements
                </h3>
                <p className="text-gray-700">
                  We may disclose information when required by law or to protect
                  our legal rights and safety.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.4 Business Transactions
                </h3>
                <p className="text-gray-700">
                  Information may be transferred in the event of a merger,
                  acquisition, or sale of assets.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical, administrative, and physical
              security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the Internet or electronic
              storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies and similar tracking technologies to
              enhance your experience, remember preferences, and gather
              analytics. You can control cookie preferences through your browser
              settings.
            </p>
            <p className="text-gray-700">Types of cookies we use:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
              <li>Essential cookies (required for site functionality)</li>
              <li>Performance cookies (analytics and improvements)</li>
              <li>Functional cookies (remember preferences)</li>
              <li>Marketing cookies (targeted advertising)</li>
            </ul>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
              <li>Portability of your data</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>
          </section>

          {/* Third-Party Links */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Third-Party Links
            </h2>
            <p className="text-gray-700">
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites. We
              encourage you to review their privacy policies before providing
              any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If we become aware that we have collected information
              from a child under 13, we will take steps to delete such
              information promptly.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Data Retention
            </h2>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, comply with
              legal obligations, and resolve disputes. You may request deletion
              of your data subject to legal retention requirements.
            </p>
          </section>

          {/* International Data Transfer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. International Data Transfer
            </h2>
            <p className="text-gray-700">
              Your information may be transferred to, stored in, and processed
              in countries other than your country of residence. These countries
              may have data protection laws that differ from your country. By
              using our services, you consent to the transfer of your
              information as described in this Privacy Policy.
            </p>
          </section>

          {/* Updates to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the updated policy
              on our website and updating the "Last Updated" date. Your
              continued use of our services following the posting of revised
              Privacy Policy means that you accept and agree to the changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-2">
                <strong>Dite Meals</strong>
              </p>
              <p className="text-gray-700 mb-2">
                Email:{" "}
                <a
                  href="mailto:privacy@dite-meals.com"
                  className="text-green-600 hover:text-green-700"
                >
                  privacy@dite-meals.com
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                Phone:{" "}
                <a
                  href="tel:+1-800-MEALS-01"
                  className="text-green-600 hover:text-green-700"
                >
                  +1-800-MEALS-01
                </a>
              </p>
              <p className="text-gray-700">Address: [Your Business Address]</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
            <p className="text-gray-700">
              By using Dite Meals, you acknowledge that you have read this
              Privacy Policy and agree to its terms. If you do not agree with
              our privacy practices, please do not use our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Page;
