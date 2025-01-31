/* eslint-disable react/prop-types */
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import {useCities} from "../Contexts/CitiesContext";
// eslint-disable-next-line no-unused-vars
function CountryList() {
    const {cities, isLoading} = useCities();
    if (isLoading) {
        return <Spinner />;
    }
    if (!cities.length) {
        return <Message message="add your first country" />;
    }
    const countries = cities.reduce((arr, city) => {
        if (!arr.map((el) => el.country).includes(city.country))
            return [...arr, {country: city.country, emoji: city.emoji}];
        else return arr;
    }, []);
    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                // eslint-disable-next-line react/jsx-key
                <CountryItem country={country} key={country.id} />
            ))}
        </ul>
    );
}
export default CountryList;
