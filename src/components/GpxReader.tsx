import { useEffect, useState } from "react";
import { gpx } from "@tmcw/togeojson";

const GPXViewer = () => {
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        fetch("/fells_loop.gpx")
            .then((response) => response.text())
            .then((gpxText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(gpxText, "application/xml");
                const geoJson = gpx(xmlDoc); // Convert to GeoJSON

                const lineString = geoJson.features.find(f => f.geometry.type === "LineString");

                if (lineString) {
                    const routeCoordinates = lineString.geometry.coordinates;
                    // console.log(routeCoordinates); // Array of [lon, lat, elevation]
                    setGeoJsonData(routeCoordinates);
                }

            })
            .catch((error) => console.error("Error loading GPX file:", error));
    }, []);




    return (
        <div>
            <h1>GPX to GeoJSON Viewer</h1>
            {geoJsonData ?
                (
                    geoJsonData.map((coord) => <p>{coord[0]}, {coord[1]}, {coord[2]}</p>)
                ) : (
                    <p>Loading GPX file...</p>
                )}
        </div>
    )
};


export default GPXViewer;
