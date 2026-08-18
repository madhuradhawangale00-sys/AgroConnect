import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageBackground } from '@/components/PageBackground'

const cropHelpTopics = [
  {
    title: 'Pest Control',
    description: 'Learn about common pests and how to control them effectively.',
    icon: '🐛',
  },
  {
    title: 'Soil Management',
    description: 'Understand soil types and how to maintain soil health.',
    icon: '🌱',
  },
  {
    title: 'Irrigation Techniques',
    description: 'Explore various irrigation methods for optimal water usage.',
    icon: '💧',
  },
  {
    title: 'Crop Rotation',
    description: 'Learn about the benefits and strategies for crop rotation.',
    icon: '🔄',
  },
]

export default function CropHelpPage() {
  return (
    <DashboardLayout>
      <PageBackground imageSrc="/resources/background4.jpeg" />
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-extrabold text-white">Agronomy & Crop Advisory</h1>
        <p className="text-slate-300 text-sm">Expert agricultural guides for soil health, pest protection, and yield optimization.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cropHelpTopics.map((topic, index) => (
          <Card key={index} className="bg-slate-900/90 border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/50">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl">
                <span className="mr-3 text-3xl">{topic.icon}</span>
                {topic.title}
              </CardTitle>
              <CardDescription className="text-slate-300 text-sm leading-relaxed mt-2">{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full font-bold text-slate-200 hover:text-white">Learn More</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}

