/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {useNavigate, useSearchParams} from "react-router-dom";
import styles from "./Map.module.css";
import {MapContainer, TileLayer, Popup, Marker, useMap, useMapEvent, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import {useCities} from "../Contexts/CitiesContext";
import {useGeolocation} from "../hooks/useGeoLocation";
import {useUrlPosition} from "../hooks/useUrlPosition";

import Button from "./Button";
function Map() {
    const navigate = useNavigate();
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const [mapLat, mapLng] = useUrlPosition();
    const {cities} = useCities();
    const {position: geoLocationPosition, isLoading: isLoadingPosition, getPosition} = useGeolocation();
    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLng, mapLat]
    );
    useEffect(
        function () {
            if (geoLocationPosition.lat) setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
        },
        [geoLocationPosition]
    );
    return (
        <div className={styles.mapContainer}>
            <Button type="position" onClick={getPosition}>
                {isLoadingPosition ? "..loading" : "Use your posioitn"}
            </Button>
            <MapContainer center={mapPosition} zoom={13} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            {city.cityName === "Madirid" ? (
                                <span> HALA {city.cityName} ⚽👑⭐</span>
                            ) : (
                                <span>{city.cityName}</span>
                            )}
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}
function ChangeCenter({position}) {
    const map = useMap();
    map.setView(position);
    return null;
}
function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
}
export default Map;
