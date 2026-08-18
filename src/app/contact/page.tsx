// import Header from "@/components/layout/header"
// import Footer from "@/components/layout/footer"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

// export default function Contact() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1 container mx-auto px-4 py-16">
//         <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
//         <div className="grid md:grid-cols-2 gap-12">
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
//             <p className="mb-4">We would love to hear from you. Please fill out the form below and we will get back to you as soon as possible.</p>
//             <form className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" name="name" required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" name="email" type="email" required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="message">Message</Label>
//                 <Textarea id="message" name="message" required rows={5} />
//               </div>
//               <Button type="submit">Send Message</Button>
//             </form>
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Address</h3>
//                 <p>123 KisanMitra Street, Agri Tower</p>
//                 <p>New Delhi, 110001</p>
//                 <p>India</p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Phone</h3>
//                 <p>+91 1234567890</p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Email</h3>
//                 <p>info@kisanmitra.com</p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Business Hours</h3>
//                 <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
//                 <p>Saturday: 10:00 AM - 4:00 PM</p>
//                 <p>Sunday: Closed</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
"use client"

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, Sprout } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sprout className="h-4 w-4" /> Support & Partnership Enquiries
          </div>
          <h1 className="text-4xl font-extrabold text-white">Contact AgroConnect Support</h1>
          <p className="text-slate-400 text-sm">Have questions about contract farming, buyer onboarding, or KYC verification? Reach out to our agricultural desk.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-900/90 border-slate-800 p-6 shadow-2xl backdrop-blur-md">
            <CardContent className="space-y-6 pt-2">
              <h2 className="text-2xl font-bold text-white mb-4">Send Us a Message</h2>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your inquiry has been sent to our agricultural support team.'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200 text-sm font-medium">Your Name</Label>
                  <Input id="name" name="name" required placeholder="Farmer or Corporate Representative" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 text-sm font-medium">Email Address</Label>
                  <Input id="email" name="email" type="email" required placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-200 text-sm font-medium">Message / Enquiry</Label>
                  <Textarea id="message" name="message" required rows={5} placeholder="How can we assist with your crop contracts or registration?" />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800 p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
            <CardContent className="space-y-6 pt-2">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6 text-slate-300 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl mt-1 shrink-0 border border-slate-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">AgroConnect Headquarters</h3>
                    <p className="text-slate-400 mt-1">123 AgroConnect Street, Agri Tower</p>
                    <p className="text-slate-400">New Delhi, 110001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl mt-1 shrink-0 border border-slate-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Farmer Support Toll-Free</h3>
                    <p className="text-slate-400 mt-1">+91 1800-AGRO-CONNECT (+91 1800 2476 266)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl mt-1 shrink-0 border border-slate-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Official Email</h3>
                    <p className="text-slate-400 mt-1">support@agroconnect-kisanmitra.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 text-amber-400 rounded-xl mt-1 shrink-0 border border-slate-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Operating Hours</h3>
                    <p className="text-slate-400 mt-1">Monday - Saturday: 8:00 AM - 8:00 PM IST</p>
                    <p className="text-slate-400">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

