'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  name: string
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/')
      return
    }

    // Получаем данные о погоде
    fetchWeatherData()
  }, [router])

  const fetchWeatherData = async () => {
    try {
      // Замените YOUR_API_KEY на ваш ключ от OpenWeatherMap
      const API_KEY = '433206afd7aaf0e3c070d4e821d63513'
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=${API_KEY}&units=metric&lang=ru`
      )

      if (response.ok) {
        const data: WeatherData = await response.json()
        setWeatherData(data)
      } else {
        setError('Ошибка получения данных о погоде')
      }
    } catch (err) {
      setError('Ошибка подключения к сервису погоды')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    router.push('/')
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка данных о погоде...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <p className="text-gray-600 mb-4">
            Пожалуйста, добавьте ваш API ключ от OpenWeatherMap в код
          </p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white">Погода в Москве</h1>
          <button
            onClick={handleLogout}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            Выйти
          </button>
        </div>

        {/* Weather Card */}
        {weatherData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={getWeatherIcon(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                  className="w-20 h-20"
                />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {Math.round(weatherData.main.temp)}°C
              </h2>
              
              <p className="text-xl text-gray-600 mb-4 capitalize">
                {weatherData.weather[0].description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium">
                    Ощущается как
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {Math.round(weatherData.main.feels_like)}°C
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 font-medium">
                    Влажность
                  </div>
                  <div className="text-2xl font-bold text-green-800">
                    {weatherData.main.humidity}%
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 mt-4">
                <div className="text-sm text-purple-600 font-medium">
                  Скорость ветра
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  {weatherData.wind.speed} м/с
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Date */}
        <div className="text-center mt-6">
          <p className="text-white/80">
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}