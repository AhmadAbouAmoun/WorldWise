/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import {createContext, useContext, useEffect, useReducer, useState} from "react";
const Base_URL = "http://localhost:3000/cities";

const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return {...state, isLoading: true};
        case "cities/loaded":
            return {...state, isLoading: false, cities: action.payload};
        case "city/loaded":
            return {...state, isLoading: false, currentCity: action.payload};
        case "cities/created":
            return {...state, isLoading: false, cities: [...state.cities, action.payload]};
        case "cities/deleted":
            return {...state, isLoading: false, cities: state.cities.filter((city) => city.id !== action.payload)};
        case "rejected":
            return {...state, isLoading: false, error: action.payload};
    }
}

function CitiesProvider({children}) {
    const [{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initialState);
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCities() {
            dispatch({type: "loading"});
            try {
                const res = await fetch(Base_URL);
                const data = await res.json();
                dispatch({type: "cities/loaded", payload: data});
                console.log(data);
            } catch {
                dispatch({type: "rejected", payload: "there was an error"});
            }
        }
        fetchCities();
    }, []);
    async function getCity(id) {
        dispatch({type: "loading"});
        try {
            const result = await fetch(`${Base_URL}/${id}`);
            const data = await result.json();
            dispatch({type: "city/loaded", payload: data});
        } catch {
            dispatch({type: "rejected", payload: "there was an error"});
        }
    }
    async function createCity(newCity) {
        dispatch({type: "loading"});
        try {
            const result = await fetch(`${Base_URL}`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {"Content-Type": "application/json"},
            });
            const data = await result.json();
            dispatch({type: "cities/created", payload: data});
        } catch {
            dispatch({type: "rejected", payload: "there was an error"});
        }
    }
    async function deleteCity(id) {
        dispatch({type: "loading"});
        try {
            const result = await fetch(`${Base_URL}/${id}`, {
                method: "DELETE",
            });
            dispatch({type: "cities/deleted", payload: id});
        } catch {
            dispatch({type: "rejected", payload: "there was an error"});
        }
    }
    console.log(cities);

    return (
        <CitiesContext.Provider value={{getCity, cities, isLoading, currentCity, createCity, deleteCity}}>
            {children}
        </CitiesContext.Provider>
    );
}
function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider");
    return context;
}
export {useCities, CitiesProvider};
