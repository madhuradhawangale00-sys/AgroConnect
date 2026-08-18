// import Link from 'next/link'
// import Image from 'next/image'

// export default function Footer() {
//   return (
//     <footer className="relative bg-transparent text-white">
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src="/placeholder.svg?height=400&width=1920"
//           alt="Footer background"
//           layout="fill"
//           objectFit="cover"
//           className="opacity-30"
//         />
//       </div>
//       <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
//         <div>
//           <h3 className="text-lg font-semibold mb-4">About AgroConnect</h3>
//           <p className="text-sm">
//             Empowering farmers and buyers through innovative technology and fair trade practices
//           </p>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//           <ul className="space-y-2">
//             <li><Link href="/" className="text-sm hover:text-primary">Home</Link></li>
//             <li><Link href="/#features" className="text-sm hover:text-primary">Features</Link></li>
//             <li><Link href="/#how-it-works" className="text-sm hover:text-primary">How It Works</Link></li>
//             <li><Link href="/#contact" className="text-sm hover:text-primary">Contact Us</Link></li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold mb-4">Legal</h3>
//           <ul className="space-y-2">
//             <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
//             <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
//             <li><Link href="/cookies" className="text-sm hover:text-primary">Cookie Policy</Link></li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
//           <ul className="space-y-2">
//             <li><a href="#" className="text-sm hover:text-primary">Facebook</a></li>
//             <li><a href="#" className="text-sm hover:text-primary">Twitter</a></li>
//             <li><a href="#" className="text-sm hover:text-primary">LinkedIn</a></li>
//             <li><a href="#" className="text-sm hover:text-primary">Instagram</a></li>
//           </ul>
//         </div>
//       </div>
//       <div className="container py-4 border-t border-white/10 relative z-10">
//         <p className="text-sm text-center">
//           © 2024 AgroConnect. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   )
// }

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative bg-transparent text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/resources/background5.jpeg"
          alt="Footer background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
      </div>
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">About AgroConnect</h3>
          <p className="text-sm text-slate-300">
            Empowering farmers and buyers through innovative technology and fair trade practices
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-sm hover:text-primary">Home</Link></li>
            <li><Link href="/#features" className="text-sm hover:text-primary">Features</Link></li>
            <li><Link href="/#how-it-works" className="text-sm hover:text-primary">How It Works</Link></li>
            <li><Link href="/#contact" className="text-sm hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
            <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/cookies" className="text-sm hover:text-primary">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:text-primary">Facebook</a></li>
            <li><a href="#" className="text-sm hover:text-primary">Twitter</a></li>
            <li><a href="#" className="text-sm hover:text-primary">LinkedIn</a></li>
            <li><a href="#" className="text-sm hover:text-primary">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="container py-4 border-t border-white/10 relative z-10">
        <p className="text-sm text-center text-slate-300">
          © {new Date().getFullYear()} AgroConnect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}