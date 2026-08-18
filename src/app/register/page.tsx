"use client"

import { FormEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// import { Upload } from 'lucide-react'
import { register } from "@/app/actions/register"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Image from 'next/image'

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry",
]

export default function Register() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData(formRef.current!)

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const response = await register({
      email: formData.get("email") as string,
      password: password,
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      aadhar: formData.get("aadhar") as string,
      role: formData.get("role") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
    })

    if (response?.error) {
      setError(response.error)
      setSuccess(null)
    } else {
      setError(null)
      setSuccess(true)
      formRef.current?.reset()
      setTimeout(() => router.push("/login"), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 -z-10">
        <Image
          src="/resources/background1.jpeg"
          alt="Farm landscape"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
/>

          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
        
        <div className="container grid lg:grid-cols-2 gap-12 py-12">
          <div className="flex flex-col justify-center text-white">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Registration Form</h1>
            <p className="text-xl mb-8 drop-shadow">Register yourself as a farmer/buyer.</p>
          </div>

          <div className="bg-white/95 p-8 rounded-lg shadow-lg backdrop-blur-sm max-w-md w-full mx-auto">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-500 bg-green-100 rounded-md">
                  Registration successful! Redirecting...
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm text-black font-medium">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-black font-medium text-black">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm text-black font-medium">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Phone"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="aadhar" className="text-sm text-black font-medium text-black">
                  Aadhar Number
                </label>
                <input
                  id="aadhar"
                  name="aadhar"
                  maxLength={12}
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Aadhar Number"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm text-black font-medium">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue="Farmer"
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                >
                  <option value="Farmer">Farmer (Sell Produce & Form Contracts)</option>
                  <option value="Buyer">Buyer (Company / Trader / Procurement Agent)</option>
                  <option value="Admin">Admin (KYC Review & Platform Oversight)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm text-black font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="w-full p-3 rounded-md border bg-white/50 text-black"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm text-black font-medium text-black">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    className="w-full p-3 rounded-md border bg-white/50 text-black"
                  >
                    <option value="">Select state</option>
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm text-black font-medium text-black">
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Pincode"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-black font-medium text-black">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm text-black font-medium text-black">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full p-3 rounded-md border bg-white/50 text-black"
                  placeholder="Confirm Password"
                />
              </div>             
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-black/90 transition-colors"
              >
                Register
              </button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-blue-500 hover:text-blue-700">
                  Already have an account? Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

