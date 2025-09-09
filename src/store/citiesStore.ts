import { signal } from "@preact/signals";

interface CitiesState {
    cities: string[];
    isLoading: boolean;
    error: string | null;
}

const initialState: CitiesState = {
    cities: [],
    isLoading: false,
    error: null
};

export const citiesStore = signal<CitiesState>(initialState);

export const fetchCities = async () => {
    // Already fetched
    if (citiesStore.value.cities.length > 0) {
        return;
    }

    citiesStore.value = { ...citiesStore.value, isLoading: true };

    try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities");
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
            const cityNames = data.data.map((item: any) => item.city);
            citiesStore.value = {
                cities: cityNames,
                isLoading: false,
                error: null
            };
        }
    } catch (error) {
        citiesStore.value = {
            ...citiesStore.value,
            isLoading: false,
            error: "Failed to fetch cities"
        };
    }
};