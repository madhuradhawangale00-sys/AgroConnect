import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageBackground } from '@/components/PageBackground'

const services = [
  {
    title: 'Transportation',
    description: 'Reliable transportation services for your crops.',
    icon: '🚚',
  },
  {
    title: 'Storage Facilities',
    description: 'State-of-the-art storage solutions for your harvest.',
    icon: '🏭',
  },
  {
    title: 'Crop Insurance',
    description: 'Protect your crops against unforeseen circumstances.',
    icon: '🛡️',
  },
  {
    title: 'Equipment Rental',
    description: 'Rent modern farming equipment for improved efficiency.',
    icon: '🚜',
  },
  {
    title: 'Soil Testing',
    description: 'Professional soil analysis and recommendations.',
    icon: '🧪',
  },
  {
    title: 'Marketing Services',
    description: 'Expert help in marketing and selling your produce.',
    icon: '📊',
  },
]

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <PageBackground imageSrc="/resources/background6.jpeg" />
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-extrabold text-white">Agricultural Support & Logistics</h1>
        <p className="text-slate-300 text-sm">Verified 3rd party logistics, cold storage, insurance, and equipment rental partners.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Card key={index} className="bg-slate-900/90 border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/50">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl">
                <span className="mr-3 text-3xl">{service.icon}</span>
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-slate-300 text-sm leading-relaxed">{service.description}</CardDescription>
              <Button variant="secondary" className="w-full font-bold text-slate-200 hover:text-white">Learn More</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}

