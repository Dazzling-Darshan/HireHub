import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How do I create an account on HireHub?',
      answer: 'Click on the "Sign Up" button on the homepage. Fill in your name, email address, and create a password. You can also sign up using your Google or LinkedIn account for faster registration.'
    },
    {
      question: 'Is HireHub free to use?',
      answer: 'Yes! HireHub is completely free for job seekers. You can search for jobs, create a profile, and apply to positions without any cost. Employers may have paid options for premium features.'
    },
    {
      question: 'How do I upload my resume?',
      answer: 'Go to your Profile page, click on "Edit Profile", and look for the "Resume" section. You can upload PDF, DOC, or DOCX files. We recommend keeping your resume under 2MB for best results.'
    },
    {
      question: 'How can I improve my chances of getting hired?',
      answer: 'Complete your profile with detailed work experience and skills, upload a professional resume, customize your applications for each job, and keep your profile updated regularly.'
    },
    {
      question: 'How do I track my job applications?',
      answer: 'Go to your Profile page and click on the "Applied Jobs" tab. There you can see all the jobs you\'ve applied for, along with their current status (pending, reviewed, shortlisted, or rejected).'
    },
    {
      question: 'Can I save jobs to apply for later?',
      answer: 'Yes! Click the bookmark icon on any job listing to save it. You can find all your saved jobs in your Profile under the "Saved Jobs" tab.'
    },
    {
      question: 'How do I edit my profile information?',
      answer: 'Navigate to your Profile page and click the "Edit Profile" button. From there, you can update your personal information, work experience, education, skills, and more.'
    },
    {
      question: 'What should I do if I forget my password?',
      answer: 'Click on "Login" and then "Forgot Password". Enter your email address, and we\'ll send you a link to reset your password. The link is valid for 24 hours.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'If you wish to delete your account, please contact our support team through the Contact Us page. We will process your request within 48 hours.'
    },
    {
      question: 'How do employers contact me?',
      answer: 'Employers can contact you through the email address associated with your account or via the messaging system on HireHub. Make sure your contact information is up to date!'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-3 text-center">Frequently Asked Questions</h1>
        <p className="text-[#64748B] text-center mb-12">Find answers to the most common questions about HireHub</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-[#0F172A]">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#2563EB]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#64748B]" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-sm text-[#64748B] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#64748B] mb-4">Still have questions?</p>
          <a href="/contact" className="inline-block bg-[#2563EB] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition">
            Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FAQs
