export type PlaceCoordsResp = {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    lat: string
    lon: string
    class: string
    type: string
    place_rank: number
    importance: number
    addresstype: string
    name: string
    display_name: string
    boundingbox: string[]
}

export interface City {
    label: string
    lat: string
    lon: string
}

export interface WeatherResp {
    coord: {
        lon: number
        lat: number
    }
    weather: {
        id: number
        main: string
        description: string
        icon: string
    }[]
    base: string
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
    }
    visibility: number
    wind: {
        speed: number
        deg: number
    }
    clouds: {
        all: number
    }
    dt: number
    sys: {
        type: number
        id: number
        country: string
        sunrise: number
        sunset: number
    }
    timezone: number
    id: number
    name: string
    cod: number
}
