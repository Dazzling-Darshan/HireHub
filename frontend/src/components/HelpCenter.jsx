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
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      articles: [
        { title: 'How to create an account', description: 'Learn how to sign up and set up your profile' },
        { title: 'Complete your profile', description: 'Tips to make your profile stand out to employers' },
        { title: 'Uploading your resume', description: 'Best practices for resume uploads' }
      ]
    },
    {
      id: 'job-search',
      title: 'Job Search & Applications',
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      articles: [
        { title: 'Searching for jobs', description: 'How to use filters and search effectively' },
        { title: 'Applying for jobs', description: 'Step-by-step guide to submitting applications' },
        { title: 'Tracking your applications', description: 'Keep track of where you\'ve applied' }
      ]
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      icon: <User className="w-6 h-6 text-primary" />,
      articles: [
        { title: 'Updating your profile', description: 'How to edit your personal information' },
        { title: 'Changing your password', description: 'Security best practices' },
        { title: 'Notification preferences', description: 'Manage email and push notifications' }
      ]
    },
    {
      id: 'security',
      title: 'Privacy & Security',
      icon: <Shield className="w-6 h-6 text-primary" />,
      articles: [
        { title: 'Account security', description: 'Protect your account from unauthorized access' },
        { title: 'Data privacy', description: 'How we handle your personal information' },
        { title: 'Reporting issues', description: 'How to report suspicious activity' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in duration-500">
        <div className="text-center mb-16">
          <HelpCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">Help Center</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of HireHub
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-14 pr-6 py-5 border border-border rounded-2xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-card rounded-3xl border border-border p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
              </div>
              <div className="space-y-4">
                {category.articles.map((article, index) => (
                  <div key={index} className="p-4 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group">
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 font-medium">{article.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-primary rounded-3xl p-12 text-center text-primary-foreground shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/5 to-primary-foreground/0 pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-4">Still Need Help?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg font-medium">
            If you couldn't find the answer you're looking for, our support team is here to help.
          </p>
          <a href="/contact" className="inline-block bg-background text-foreground font-bold px-8 py-4 rounded-xl hover:bg-muted transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Contact Support
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HelpCenter
