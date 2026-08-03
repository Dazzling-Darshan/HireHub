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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-500">
        <h1 className="text-4xl font-extrabold text-foreground mb-3 text-center tracking-tight">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-center mb-12 font-medium text-lg">Find answers to the most common questions about HireHub</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <button 
                className="w-full px-8 py-5 flex justify-between items-center text-left hover:bg-muted/50 transition-colors cursor-pointer border-none bg-transparent"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-foreground text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-base text-muted-foreground leading-relaxed font-medium animate-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-primary/5 rounded-3xl p-10 border border-primary/10">
          <p className="text-muted-foreground mb-6 font-bold text-lg">Still have questions?</p>
          <a href="/contact" className="inline-block bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FAQs
