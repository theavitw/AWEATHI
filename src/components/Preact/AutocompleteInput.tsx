import { useState, useRef, useEffect } from 'preact/hooks'
import { citiesStore, fetchCities } from '../../store/citiesStore'

interface AutocompleteProps {
  value: string
  onChange: (val: string) => void
  onSelect: (val: string) => void
}

const AutocompleteInput = ({ value, onChange, onSelect }: AutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Fetch cities only once when component mounts
    fetchCities();
  }, []);

  const handleInput = (val: string) => {
    onChange(val)
    if (!val) {
      setSuggestions([])
      return
    }

    const filtered: string[] = citiesStore.value.cities.filter((city: string) =>
      city.toLowerCase().includes(val.toLowerCase())
    )
    setSuggestions(filtered.slice(0, 6))
  }

  const handleSelect = (city: string) => {
    onChange(city)
    setSuggestions([])
    onSelect(city)
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        ref={inputRef}
        value={value}
        onInput={(e) => handleInput((e.target as HTMLInputElement).value)}
        onFocus={() => {
          setIsFocused(true)
          handleInput(value || '')
        }}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        placeholder="Search City"
        className="w-full h-[35px] px-4 rounded border-none outline-none text-black"
      />

      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-[38px] left-0 w-full bg-white text-black rounded shadow-lg z-50 max-h-[200px] overflow-y-scroll zIndex-50">
          {suggestions.map((city) => (
            <li
              key={city}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutocompleteInput
