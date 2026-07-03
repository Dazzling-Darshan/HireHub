import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">1. Introduction</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Welcome to HireHub. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our job portal platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">2. Information We Collect</h2>
            <div className="space-y-3">
              <p className="text-sm text-[#64748B] leading-relaxed">
                <strong>Personal Information:</strong> When you create an account, we collect your name, email address, phone number, and profile details.
              </p>
              <p className="text-sm text-[#64748B] leading-relaxed">
                <strong>Resume and Documents:</strong> You may upload your resume, cover letters, and other relevant documents.
              </p>
              <p className="text-sm text-[#64748B] leading-relaxed">
                <strong>Usage Data:</strong> We collect information about how you interact with our platform, such as jobs viewed, applications submitted, and preferences.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#64748B]">
              <li>To provide and maintain our services</li>
              <li>To process your job applications</li>
              <li>To communicate with you about job opportunities and updates</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">4. Data Sharing</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              We share your information with employers when you apply for jobs. We do not sell your personal data to third parties. We may share data with service providers who help us operate our platform, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">5. Data Security</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">6. Your Rights</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              You have the right to access, correct, or delete your personal data. You can also opt out of certain communications. To exercise these rights, please contact us through our Contact Us page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">7. Changes to This Policy</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date below.
            </p>
            <p className="text-sm text-[#64748B] mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
