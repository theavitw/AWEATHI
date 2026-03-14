import { toastData } from "../store/weatherStore"

interface LocationType {
    latitude: string,
    longitude: string,
}

const API_KEY = "5b50bebbb83545c38ec54228250509";
const BASE_URL = `https://api.weatherapi.com/v1/forecast.json`

export const FetchWeatherQuery = async (query: string, signal?: AbortSignal) => {
    const URL_Params = new URLSearchParams({
        key: API_KEY,
        q: query,
        days: "3",
        aqi: "yes",
        alerts: "no"
    })

    try {
        const res = await fetch(`${BASE_URL}?${URL_Params.toString()}`, { signal })
        const data = await res.json()
        // console.log("Fetch:", data)

        if (!data.error) {
            return data
        } else {
            toastData.set({
                status: "error",
                message: "Invalid City name!"
            })
            throw new Error("Invalid City name!");
        }
    } catch (err) {
        // AbortError is expected when a newer request cancels this one; ignore silently
        if (err instanceof Error && err.name === "AbortError") return
        console.log("ERROR:", err)
    }
}

export const FetchWeatherPosition = async (pos: LocationType, signal?: AbortSignal) => {
    const URL_Params = new URLSearchParams({
        key: API_KEY,
        q: `${pos.latitude},${pos.longitude}`,
        days: "3",
        aqi: "yes",
        alerts: "no"
    })

    try {
        const res = await fetch(`${BASE_URL}?${URL_Params.toString()}`, { signal })
        const data = await res.json()
        // console.log("GEO:", data)

        if (!data.error) {
            return data
        } else {
            toastData.set({
                status: "error",
                message: "Invalid Position coordinates!"
            })
            throw new Error("Invalid Position coordinates!");
        }
    } catch (err) {
        // AbortError is expected when a newer request cancels this one; ignore silently
        if (err instanceof Error && err.name === "AbortError") return
        console.log("ERROR:", err)
    }
}