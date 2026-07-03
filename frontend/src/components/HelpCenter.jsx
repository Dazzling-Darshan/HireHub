import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'
import { Search, BookOpen, Briefcase, User, Shield, HelpCircle } from 'lucide-react'

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="w-6 h-6 text-[#2563EB]" />,
      articles: [
        { title: 'How to create an account', description: 'Learn how to sign up and set up your profile' },
        { title: 'Complete your profile', description: 'Tips to make your profile stand out to employers' },
        { title: 'Uploading your resume', description: 'Best practices for resume uploads' }
      ]
    },
    {
      id: 'job-search',
      title: 'Job Search & Applications',
      icon: <Briefcase className="w-6 h-6 text-[#2563EB]" />,
      articles: [
        { title: 'Searching for jobs', description: 'How to use filters and search effectively' },
        { title: 'Applying for jobs', description: 'Step-by-step guide to submitting applications' },
        { title: 'Tracking your applications', description: 'Keep track of where you\'ve applied' }
      ]
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      icon: <User className="w-6 h-6 text-[#2563EB]" />,
      articles: [
        { title: 'Updating your profile', description: 'How to edit your personal information' },
        { title: 'Changing your password', description: 'Security best practices' },
        { title: 'Notification preferences', description: 'Manage email and push notifications' }
      ]
    },
    {
      id: 'security',
      title: 'Privacy & Security',
      icon: <Shield className="w-6 h-6 text-[#2563EB]" />,
      articles: [
        { title: 'Account security', description: 'Protect your account from unauthorized access' },
        { title: 'Data privacy', description: 'How we handle your personal information' },
        { title: 'Reporting issues', description: 'How to report suspicious activity' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-[#2563EB] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#0F172A] mb-3">Help Center</h1>
          <p className="text-[#64748B] max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of HireHub
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input 
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold text-[#0F172A]">{category.title}</h2>
              </div>
              <div className="space-y-3">
                {category.articles.map((article, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <h3 className="font-medium text-[#0F172A] text-sm">{article.title}</h3>
                    <p className="text-xs text-[#64748B] mt-1">{article.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-[#2563EB] rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer you're looking for, our support team is here to help.
          </p>
          <a href="/contact" className="inline-block bg-white text-[#2563EB] font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Contact Support
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HelpCenter
