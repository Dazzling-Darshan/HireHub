import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-500">
        <h1 className="text-4xl font-extrabold text-foreground mb-10 tracking-tight">Terms & Conditions</h1>
        
        <div className="bg-card rounded-3xl border border-border p-10 shadow-xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              By accessing and using HireHub, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. User Accounts</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Conduct</h2>
            <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground font-medium ml-2">
              <li>Use the platform only for lawful purposes</li>
              <li>Do not misrepresent yourself or your qualifications</li>
              <li>Do not interfere with the proper functioning of the platform</li>
              <li>Do not attempt to gain unauthorized access to other users' accounts</li>
              <li>Respect the intellectual property rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Job Postings and Applications</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              Employers are responsible for the accuracy of job postings. Job seekers are responsible for the accuracy of their applications. We do not guarantee job placements or the accuracy of any information on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              All content on HireHub, including text, graphics, logos, and software, is the property of HireHub or its licensors and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              HireHub is provided on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Termination</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to Terms</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              We may update these Terms & Conditions from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
            <p className="text-sm text-muted-foreground mt-4 font-bold">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsAndConditions
