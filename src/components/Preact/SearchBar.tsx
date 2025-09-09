import { useState, useEffect } from 'preact/hooks'
import { FetchWeatherQuery, FetchWeatherPosition } from '../../hooks/useFetchWeather'
import MapPin from '../SVG/MapPin'
import { toastData, weather } from '../../store/weatherStore'
import { useIconCode } from '../../hooks/useIconCode'
import AutocompleteInput from './AutocompleteInput'

const SearchBar = () => {
  const [query, setQuery] = useState("New York, US")

  const HandleSearch = async (val?: string) => {
    const searchValue = val || query
    if (!searchValue) return
    const data = await FetchWeatherQuery(searchValue)
    if (data) {
      weather.set(data)
      useIconCode()
    }
  }

  const setPosition = async (position: any) => {
    const pos = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString()
    }
    try {
      const data = await FetchWeatherPosition(pos)
      weather.set(data)
      useIconCode()
    } catch (error) {
      console.log(error)
    }
  }

  const handleError = (error: any) => {
    toastData.set({ status: "error", message: error.message })
    if (query === "") setQuery("New York, US")
    HandleSearch()
  }

  const HandleGeoLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        setPosition,
        handleError,
        { enableHighAccuracy: true, maximumAge: 10000 }
      )
    } else {
      toastData.set({ status: "error", message: "No GeoLocation Support" })
    }
  }

  useEffect(() => {
    if (query === "") setQuery("New York, US")
    HandleSearch()
  }, [])

  return (
    <div className="flex_center gap-4 w-full sm:max-w-[400px]">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          HandleSearch()
        }}
        className="w-full relative"
      >
        <AutocompleteInput
          value={query}
          onChange={setQuery}
          onSelect={HandleSearch}
        />
      </form>

      <button
        type="button"
        title="Current Location"
        className="p-1 bg-black/20 border border-white/10 rounded"
        onClick={HandleGeoLocation}
      >
        <MapPin width="28px" height="28px" />
      </button>
    </div>
  )
}

export default SearchBar
