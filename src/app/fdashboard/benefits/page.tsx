import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageBackground } from '@/components/PageBackground'

const benefits = [
  {
    title: 'Guaranteed Income',
    description: 'Secure a stable income with pre-agreed prices for your crops.',
    icon: '💰',
  },
  {
    title: 'Market Access',
    description: 'Gain direct access to buyers and expand your market reach.',
    icon: '🌐',
  },
  {
    title: 'Risk Mitigation',
    description: 'Reduce risks associated with price fluctuations and market uncertainties.',
    icon: '🛡️',
  },
  {
    title: 'Technical Support',
    description: 'Receive expert guidance and support throughout the growing season.',
    icon: '🔧',
  },
  {
    title: 'Quality Inputs',
    description: 'Access high-quality seeds, fertilizers, and other inputs at competitive prices.',
    icon: '🌱',
  },
  {
    title: 'Financial Services',
    description: 'Benefit from easier access to loans and other financial services.',
    icon: '🏦',
  },
]

export default function BenefitsPage() {
  return (
    <DashboardLayout>
      <PageBackground imageSrc="/resources/background3.jpeg" />
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-extrabold text-white">Farmer Contract Farming Benefits</h1>
        <p className="text-slate-300 text-sm">Key advantages guaranteed under verified AgroConnect digital farming contracts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <Card key={index} className="bg-slate-900/90 border-slate-800 shadow-xl hover:border-emerald-500/50">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl">
                <span className="mr-3 text-3xl">{benefit.icon}</span>
                {benefit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300 text-sm leading-relaxed">{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
