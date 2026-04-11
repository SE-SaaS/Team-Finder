'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold text-[#f0f6fc] mb-4">Terms of Service</h1>
        <p className="text-[#8b949e] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-[#c9d1d9] leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">1. Acceptance of Terms</h2>
            <p>
              By creating an account and using TeamFinder, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">2. Eligibility</h2>
            <p className="mb-4">To use TeamFinder, you must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be a current student at the University of Jordan (JU) or Hashemite University (HU)</li>
              <li>Have a valid university email address (@ju.edu.jo or @hu.edu.jo)</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Provide accurate and truthful information in your profile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">3. Account Responsibilities</h2>
            <p className="mb-4">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintaining the security of your account credentials</li>
              <li>All activity that occurs under your account</li>
              <li>Keeping your profile information accurate and up-to-date</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Misrepresent your skills, experience, or availability</li>
              <li>Use the platform for spam, harassment, or inappropriate content</li>
              <li>Create fake accounts or impersonate others</li>
              <li>Scrape, copy, or redistribute platform content without permission</li>
              <li>Attempt to hack, reverse-engineer, or compromise platform security</li>
              <li>Use the platform for commercial purposes without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">5. Team Formation & Projects</h2>
            <p className="mb-4">When using TeamFinder:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are responsible for communicating and collaborating with your team members</li>
              <li>TeamFinder is a facilitation tool only — we are not responsible for project outcomes</li>
              <li>All academic integrity policies of your university still apply</li>
              <li>Disputes between team members should be resolved directly or with university mediation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">6. Intellectual Property</h2>
            <p>
              All platform code, design, algorithms, and branding are property of TeamFinder.
              You retain ownership of your profile content and project descriptions. By posting content,
              you grant us a license to display it on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">7. Termination</h2>
            <p className="mb-4">We reserve the right to suspend or terminate accounts that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violate these Terms of Service</li>
              <li>Engage in abusive or disruptive behavior</li>
              <li>Provide false information</li>
              <li>Are no longer associated with a supported university</li>
            </ul>
            <p className="mt-4">
              You may delete your account at any time from your profile settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">8. Disclaimers</h2>
            <p>
              TeamFinder is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Successful team formation or project completion</li>
              <li>Accuracy of user-provided information (skills, availability, etc.)</li>
              <li>Uninterrupted or error-free service</li>
              <li>Compatibility or quality of team matches</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">9. Limitation of Liability</h2>
            <p>
              TeamFinder and its creators shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the platform, including but not limited to
              failed projects, interpersonal disputes, or academic consequences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">10. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Significant changes will be communicated via email or
              platform notification. Continued use after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">11. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Hashemite Kingdom of Jordan. Disputes shall be
              resolved in Jordanian courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-4">12. Contact</h2>
            <p>
              For questions about these terms, contact us at:
            </p>
            <p className="mt-4 text-[#58a6ff]">
              <a href="mailto:legal@teamfinder.app" className="hover:underline">
                legal@teamfinder.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#30363d] flex gap-6">
          <Link href="/" className="text-[#58a6ff] hover:underline">
            ← Back to Home
          </Link>
          <Link href="/legal/privacy" className="text-[#58a6ff] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
