// 'use client'

// import { useState } from 'react'
// import { CropListing } from '../types'

// export default function ListingCard({ listing }: { listing: CropListing }) {
//   const [showInterestForm, setShowInterestForm] = useState(false)
//   const [mobileNumber, setMobileNumber] = useState('')
//   const [expectedPrice, setExpectedPrice] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     // In a real application, this would be an API call
//     console.log('Submitting interest:', { listingId: listing.id, mobileNumber, expectedPrice })
//     // Reset form and hide it
//     setMobileNumber('')
//     setExpectedPrice('')
//     setShowInterestForm(false)
//   }

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-xl font-semibold mb-2">{listing.croptype}</h2>
//       <p>Quantity: {listing.quantity} kg</p>
//       <p>Price: ${listing.price}</p>
//       {!showInterestForm ? (
//         <button
//           onClick={() => setShowInterestForm(true)}
//           className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Show Interest
//         </button>
//       ) : (
//         <form onSubmit={handleSubmit} className="mt-4">
//           <input
//             type="tel"
//             value={mobileNumber}
//             onChange={(e) => setMobileNumber(e.target.value)}
//             placeholder="Mobile Number"
//             className="w-full p-2 mb-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             value={expectedPrice}
//             onChange={(e) => setExpectedPrice(e.target.value)}
//             placeholder="Expected Price"
//             className="w-full p-2 mb-2 border rounded"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Submit Interest
//           </button>
//         </form>
//       )}
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { CropListing } from '../types'

export default function ListingCard({ listing }: { listing: CropListing }) {
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [advance, setAdvance] = useState('0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          isOffer: true,
          offerAmount: Number(expectedPrice || listing.price),
          offerQuantity: 100,
          text: `Buyer Interest from ${buyerName || 'Buyer'}: Proposed price ₹${expectedPrice || listing.price}`,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Price offer & interest submitted successfully! Redirecting to negotiation chat...');
        if (data.chatId) {
          window.location.href = `/chat/${data.chatId}`;
        }
      } else {
        alert(data.error || 'Failed to submit interest');
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
    }

    setMobileNumber('');
    setExpectedPrice('');
    setBuyerName('');
    setBuyerEmail('');
    setAdvance('0');
    setShowInterestForm(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{listing.croptype}</h2>
      <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
      <p><strong>Price:</strong> ₹{listing.price}</p>
      <p><strong>District:</strong> {listing.farmerDistrict}</p>
      <p><strong>State:</strong> {listing.farmerState}</p>
      {!showInterestForm ? (
        <button
          onClick={() => setShowInterestForm(true)}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Show Interest
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Mobile Number"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            value={expectedPrice}
            onChange={(e) => setExpectedPrice(e.target.value)}
            placeholder="Expected Price"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            value={advance}
            onChange={(e) => setAdvance(e.target.value)}
            placeholder="Advance Payment (in ₹)"
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Interest
          </button>
        </form>
      )}
    </div>
  );
}
