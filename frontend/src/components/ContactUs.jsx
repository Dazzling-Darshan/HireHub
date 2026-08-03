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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in duration-500">
        <h1 className="text-4xl font-extrabold text-foreground mb-12 tracking-tight text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Email</h3>
                    <p className="text-base text-muted-foreground font-medium mt-1">support@hirehub.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Phone</h3>
                    <p className="text-base text-muted-foreground font-medium mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Address</h3>
                    <p className="text-base text-muted-foreground font-medium mt-1">123 Career Avenue, Tech Hub, TC 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-3xl p-8 text-primary-foreground shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/0 via-primary-foreground/5 to-primary-foreground/10 pointer-events-none" />
              <h3 className="font-bold text-2xl mb-4 relative">Business Hours</h3>
              <div className="space-y-2 relative font-medium">
                <p className="text-primary-foreground/90">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-primary-foreground/90">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-primary-foreground/90">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Name</label>
                <Input 
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Email</label>
                <Input 
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Subject</label>
                <Input 
                  required
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Message</label>
                <textarea 
                  required
                  className="w-full min-h-[150px] p-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-muted/50 transition-all resize-y"
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2">
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
