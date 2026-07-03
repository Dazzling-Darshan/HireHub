import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    toast.success('Thank you! Your message has been sent. We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#2563EB]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A]">Email</h3>
                    <p className="text-sm text-[#64748B]">support@hirehub.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#2563EB]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A]">Phone</h3>
                    <p className="text-sm text-[#64748B]">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#2563EB]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A]">Address</h3>
                    <p className="text-sm text-[#64748B]">123 Career Avenue, Tech Hub, TC 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2563EB] rounded-xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
              <p className="text-sm text-blue-100">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-blue-100">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-sm text-blue-100">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Name</label>
                <Input 
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Email</label>
                <Input 
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Subject</label>
                <Input 
                  required
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Message</label>
                <textarea 
                  required
                  className="w-full min-h-[150px] p-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactUs
