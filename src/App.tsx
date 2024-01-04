import { useState } from 'react'
import './App.css'
import CityInput from './components/CityInput'
import { City } from './types/types'
import WeatherCard from './components/WeatherCard'
import { Box, Typography } from '@mui/material'

const App: React.FC = () => {
    const [selectedCity, setSelectedCity] = useState<City | null>(null)

    return (
        <>
            <h1>Weather App</h1>

            <CityInput selectedCity={selectedCity} setSelectedCity={setSelectedCity} />

            {selectedCity && (
                <Box style={{ margin: 15 }}>
                    <Typography>
                        <span style={{ fontWeight: 'bold', marginRight: 5 }}>Selected city:</span> {selectedCity.label}
                    </Typography>
                </Box>
            )}

            {selectedCity && <WeatherCard lat={selectedCity.lat} lon={selectedCity.lon} />}
        </>
    )
}

export default App
