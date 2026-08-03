import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-500">
        <h1 className="text-4xl font-extrabold text-foreground mb-10 tracking-tight">Privacy Policy</h1>
        
        <div className="bg-card rounded-3xl border border-border p-10 shadow-xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              Welcome to HireHub. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our job portal platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                <strong className="text-foreground">Personal Information:</strong> When you create an account, we collect your name, email address, phone number, and profile details.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                <strong className="text-foreground">Resume and Documents:</strong> You may upload your resume, cover letters, and other relevant documents.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                <strong className="text-foreground">Usage Data:</strong> We collect information about how you interact with our platform, such as jobs viewed, applications submitted, and preferences.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground font-medium ml-2">
              <li>To provide and maintain our services</li>
              <li>To process your job applications</li>
              <li>To communicate with you about job opportunities and updates</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Sharing</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              We share your information with employers when you apply for jobs. We do not sell your personal data to third parties. We may share data with service providers who help us operate our platform, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              You have the right to access, correct, or delete your personal data. You can also opt out of certain communications. To exercise these rights, please contact us through our Contact Us page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Changes to This Policy</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date below.
            </p>
            <p className="text-sm text-muted-foreground mt-4 font-bold">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
