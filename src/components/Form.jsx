/* eslint-disable no-unused-vars */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./Form.module.css";
import Button from "./Button";
import {useNavigate} from "react-router-dom";
import BackButton from "./BackButton";
import {useUrlPosition} from "../hooks/useUrlPosition";
import {useCities} from "../Contexts/CitiesContext";
export function convertToEmoji(countryCode) {
    const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function Form() {
    const {createCity} = useCities();
    const Base_Url = "https://api.bigdatacloud.net/data/reverse-geocode-client";
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [isLoadingGeoLocation, setisLoadingGeoLocation] = useState(false);
    const [geoLocationError, setGeoLocationError] = useState(false);
    const [lat, lng] = useUrlPosition();
    const navigate = useNavigate();
    useEffect(
        function () {
            if (!lat && !lng) return;
            async function fetchCityData() {
                try {
                    setGeoLocationError(false);
                    setisLoadingGeoLocation(true);
                    const res = await fetch(`${Base_Url}?latitude=${lat}&longitude=${lng}`);
                    const data = await res.json();
                    if (!data.countryCode) {
                        throw new Error(",,,,");
                    }
                    setCityName(data.locality || "");
                    setCountry(data.countryName);
                } catch (err) {
                    setGeoLocationError(true);
                } finally {
                    setisLoadingGeoLocation(false);
                }
            }
            fetchCityData();
        },
        [lng, lat]
    );
    async function handleSubmit(e) {
        e.preventDefault();
        if (!cityName || !date) return;
        const newCity = {
            cityName,
            country,
            date,
            notes,
            position: {
                lng,
                lat,
            },
        };
        await createCity(newCity);
        navigate("/app/cities");
    }

    if (!lat && !lng) return <Message message="Start by clicking on a city" />;
    if (isLoadingGeoLocation) {
        return <Spinner></Spinner>;
    }
    if (geoLocationError) {
        return <Message message={"This is not a country please click on another place"} />;
    }
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName} />
                {/* <span className={styles.flag}>{emoji}</span> */}
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker onChange={(date) => setDate(date)} selected={date} dateFormat="dd/MM/yyyy"></DatePicker>
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
            </div>

            <div className={styles.buttons}>
                <Button type="primary"> Add </Button>
                <BackButton></BackButton>
            </div>
        </form>
    );
}

export default Form;
