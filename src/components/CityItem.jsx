/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {Link} from "react-router-dom";
import styles from "./CityItem.module.css";
import {useCities} from "../Contexts/CitiesContext";
const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));

function CityItem({city}) {
    const {cityName, emoji, date, id, position} = city;
    const {currentCity, deleteCity} = useCities();
    function ClickHandler(e) {
        e.preventDefault();
        deleteCity(id);
    }
    return (
        <li>
            <Link
                className={`${styles.cityItem} ${id === currentCity.id ? styles["cityItem--active"] : ""}`}
                to={`${id}?lat=${position.lat}&lng=${position.lng} `}
            >
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>{formatDate(date)}</time>
                <button className={styles.deleteBtn} onClick={(e) => ClickHandler(e)}>
                    &times;
                </button>
            </Link>
        </li>
    );
}
export default CityItem;
