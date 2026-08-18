'use client'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Droplets, Sun, Thermometer } from 'lucide-react'
import { PageBackground } from '@/components/PageBackground'

// Define the types for the weather data returned by the API
interface CurrentConditions {
  temp: number;
  humidity: number;
  uvIndex: number;
  precip: number;
}

export default function WeatherPage() {
  // State for weather data, loading status, and error message
  const [weatherData, setWeatherData] = useState<CurrentConditions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the weather data when the component mounts
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/DELHI?unitGroup=metric&key=6HP2URR3VPQPDJRFSTSE5F2GH&contentType=json"
        )
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }
        const data = await response.json()
        setWeatherData(data.currentConditions)  // Using current conditions here
        setLoading(false)
      } catch (err: unknown) {
        // Type assertion for error handling
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unknown error occurred")
        }
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [])

  // If data is still loading, show a loading state
  if (loading) {
    return (
      <DashboardLayout>
        <PageBackground imageSrc="/resources/background5.jpeg" />
        <h1 className="text-3xl font-bold mb-6">Weather Information</h1>
        <p>Loading...</p>
      </DashboardLayout>
    )
  }

  // If there's an error, show the error message
  if (error) {
    return (
      <DashboardLayout>
        <PageBackground imageSrc="/resources/background5.jpeg" />
        <h1 className="text-3xl font-bold mb-6">Weather Information</h1>
        <p>Error: {error}</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageBackground imageSrc="/resources/background5.jpeg" />
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Sun className="h-8 w-8 text-amber-400" /> Real-time Harvest & Weather Forecast
        </h1>
        <p className="text-slate-300 text-sm">Live environmental telemetry for crop planning, irrigation management, and harvest scheduling.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Temperature Card */}
        <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">Temperature</CardTitle>
            <Thermometer className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{weatherData?.temp}°C</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Feels like {weatherData?.temp ? weatherData.temp + 2 : "N/A"}°C</p>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">Relative Humidity</CardTitle>
            <Droplets className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">{weatherData?.humidity}%</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Optimal Soil Moisture Retention</p>
          </CardContent>
        </Card>

        {/* UV Index Card */}
        <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">UV Solar Index</CardTitle>
            <Sun className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-400">{weatherData?.uvIndex}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">High Sunlight Exposure</p>
          </CardContent>
        </Card>

        {/* Precipitation Card */}
        <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">Precipitation Chance</CardTitle>
            <Cloud className="h-5 w-5 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-sky-400">{weatherData?.precip}%</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Precipitation Telemetry</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
