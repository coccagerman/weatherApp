import { Alert, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { WeatherResp } from '../types/types'
import axios from 'axios'
import { apiKey, urlPath } from '../services/url.path'

interface WeatherCardProps {
    lat: string
    lon: string
}

const WeatherCard: React.FC<WeatherCardProps> = ({ lat, lon }) => {
    const [weatherData, setWeatherData] = useState<WeatherResp | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showError, setShowError] = useState<boolean>(false)

    useEffect(() => {
        const fetchWeather = async () => {
            if (!lat || !lon) return

            setLoading(true)
            try {
                const response = await axios(`${urlPath.getWeather}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                const data: WeatherResp = response.data
                setWeatherData(data)
            } catch (error) {
                console.error('Error fetching weather data:', error)
                setShowError(true)
                setTimeout(() => {
                    setShowError(false)
                }, 2500)
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [lat, lon])

    return (
        <Card>
            <CardContent>
                <h2>Weather Details</h2>

                {showError ? (
                    <Alert severity='error'>An error occurred, please try again later.</Alert>
                ) : (
                    <>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                {weatherData && (
                                    <>
                                        <Typography>
                                            <span style={{ fontWeight: 'bold', marginRight: 5 }}>Temperature:</span>{' '}
                                            {weatherData?.main?.temp} °C
                                        </Typography>

                                        <Typography>
                                            <span style={{ fontWeight: 'bold', marginRight: 5 }}>Condition:</span>{' '}
                                            {weatherData?.weather?.[0]?.main} - {weatherData?.weather[0]?.description}
                                        </Typography>

                                        <Typography>
                                            <span style={{ fontWeight: 'bold', marginRight: 5 }}>Humidity:</span>{' '}
                                            {weatherData?.main?.humidity}%
                                        </Typography>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default WeatherCard
