'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#dc2626] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-[#f0f6fc] font-semibold">TeamFinder</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#f0f6fc] mb-4">Privacy Policy</h1>
        <p className="text-[#8b949e] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-[#c9d1d9] leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              When you create an account on TeamFinder, we collect and process the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>University Email:</strong> Required for account verification and access control</li>
              <li><strong>Profile Information:</strong> Name, major, year, skills, and courses completed</li>
              <li><strong>Project Data:</strong> Projects you create or join, team preferences, and availability</li>
              <li><strong>Usage Data:</strong> How you interact with the platform, features used, and timestamps</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">Your information is used exclusively for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Matching you with compatible teammates based on skills and availability</li>
              <li>Displaying your profile to other verified university students</li>
              <li>Providing personalized project recommendations</li>
              <li>Improving our matching algorithms and platform features</li>
              <li>Sending important updates about your projects and matches</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">3. Data Sharing & Privacy</h2>
            <p className="mb-4">
              <strong>We do NOT sell your data.</strong> Your information is only shared within the TeamFinder platform
              to facilitate team formation among verified university students.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your profile is visible only to other verified students at your university</li>
              <li>Your email is NEVER displayed publicly (only your name and university are shown)</li>
              <li>We use Supabase for secure data storage with industry-standard encryption</li>
              <li>Third-party services (Anthropic AI for career guidance) process data in accordance with their privacy policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">4. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and download all your personal data</li>
              <li>Update or correct your profile information at any time</li>
              <li>Delete your account and all associated data permanently</li>
              <li>Opt out of non-essential communications</li>
              <li>Request data portability to another service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>All data is encrypted in transit (HTTPS/TLS) and at rest</li>
              <li>University email verification ensures only legitimate students can join</li>
              <li>Regular security audits and updates</li>
              <li>Strict access controls and authentication requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">6. Cookies & Tracking</h2>
            <p>
              We use essential cookies to maintain your login session. We do NOT use tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes via email or
              platform announcement. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or how we handle your data, please contact us at:
            </p>
            <p className="mt-4 text-[#58a6ff]">
              <a href="mailto:privacy@teamfinder.app" className="hover:underline">
                privacy@teamfinder.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#30363d]">
          <Link href="/" className="text-[#58a6ff] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
