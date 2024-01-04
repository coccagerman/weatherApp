// Import required modules
import React, { useState, useCallback, SyntheticEvent, useRef } from 'react'
import debounce from 'lodash.debounce'
import { Autocomplete, TextField, CircularProgress, Alert } from '@mui/material'
import { City, PlaceCoordsResp } from '../types/types'
import axios from 'axios'
import { urlPath } from '../services/url.path'

interface CityInputProps {
    selectedCity: City | null
    setSelectedCity: React.Dispatch<React.SetStateAction<City | null>>
}

const CityInput: React.FC<CityInputProps> = ({ selectedCity, setSelectedCity }) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<City[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [showError, setShowError] = useState<boolean>(false)

    const selectedCityRef = useRef<City | null>(null) // Ref to keep track of the selected city

    const fetchCities = async (value: string) => {
        try {
            if (value !== selectedCity?.label) {
                setLoading(true)
                const resp = await axios(`${urlPath.placeCoords}${value}`)

                setOptions(
                    resp.data.map((item: PlaceCoordsResp) => ({
                        label: item.display_name,
                        lat: item.lat,
                        lon: item.lon
                    }))
                )
                setOpen(true)
            }
        } catch (error) {
            console.error('fetchCities error', error)
            setShowError(true)
            setTimeout(() => {
                setShowError(false)
            }, 2500)
        } finally {
            setLoading(false)
        }
    }

    const debouncedFetchCities = useCallback(
        debounce((value: string) => {
            if (value && value !== selectedCityRef.current?.label) {
                fetchCities(value)
            }
        }, 1000),
        []
    )

    const handleInputChange = (event: SyntheticEvent<Element, Event>, value: string) => {
        setInputValue(value)
        debouncedFetchCities(value)
    }

    const handleCitySelect = (event: SyntheticEvent<Element, Event>, newValue: City | null) => {
        setSelectedCity(newValue)
        selectedCityRef.current = newValue // Update the ref when a city is selected
        setOpen(false)
    }

    const handleBlur = () => {
        setTimeout(() => {
            // Add a slight delay to allow selection of an option
            setOpen(false)
        }, 100)
    }

    return (
        <>
            {showError && (
                <Alert severity='error' style={{ marginBottom: 10 }}>
                    An error occurred, please try again later.
                </Alert>
            )}

            <Autocomplete
                style={{ backgroundColor: 'white' }}
                options={options}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onChange={handleCitySelect}
                getOptionLabel={option => option.label}
                loading={loading}
                open={open}
                onClose={handleBlur}
                noOptionsText='No results found'
                renderInput={params => (
                    <TextField
                        {...params}
                        label='Enter City'
                        variant='outlined'
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
            />
        </>
    )
}

export default CityInput
