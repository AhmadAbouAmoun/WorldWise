/* eslint-disable react/prop-types */
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import {useCities} from "../Contexts/CitiesContext";
// eslint-disable-next-line no-unused-vars
function CityList() {
    const {cities, isLoading} = useCities();
    if (isLoading) {
        return <Spinner />;
    }

    if (!cities.length) {
        return <Message message="add your first city" />;
    }
    return (
        <ul className={styles.cityList}>
            {cities.map((city) => (
                <CityItem city={city} key={city.id} />
            ))}
        </ul>
    );
}
export default CityList;
