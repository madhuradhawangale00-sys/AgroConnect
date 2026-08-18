// import { NextResponse } from 'next/server'

// export async function GET(
//   request: Request,
//   { params }: { params: { interestId: string } }
// ) {
//   const interestId = params.interestId

//   // In a real application, you would fetch this data from your database
//   const mockFarmerDetails = {
//     name: 'John Doe',
//     location: 'Maharashtra, India',
//     crop: 'Wheat',
//     quantity: 1000,
//     unit: 'kg',
//     price: 25,
//     expectedDelivery: '2023-08-15',
//   }

//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1000))

//   return NextResponse.json(mockFarmerDetails)
// }

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || request.headers.get('email') || '';

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const farmer = await User.findOne({ email }).select('-password').lean();

    if (!farmer) {
      return NextResponse.json({ message: 'Farmer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, farmer });
  } catch (error) {
    console.error('Error fetching farmer details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}



