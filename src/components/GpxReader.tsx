import { useEffect, useState } from "react";
import { gpx } from "@tmcw/togeojson";

const GPXViewer = () => {
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        fetch("/aug29.gpx")
            .then((response) => response.text())
            .then((gpxText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(gpxText, "application/xml");
    
                const geoJson = gpx(xmlDoc);
               // console.log("Full GeoJSON:", geoJson); // Debugging output
    
                // Extract and flatten all LineString coordinates
                const routeCoordinates = geoJson.features
                    .filter(f => f.geometry.type === "LineString")
                    .flatMap(f => f.geometry.coordinates);
    
                if (routeCoordinates.length) {
                    setGeoJsonData(routeCoordinates);
                    sendDataToBackend(routeCoordinates);
                }
            })
            .catch((error) => console.error("Error loading GPX file:", error));
    }, []);
    

    const sendDataToBackend = async (routeCoordinates) => {
        try {
            const response = await fetch("http://localhost:5000/api/upload-gpx", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ route: routeCoordinates }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            //console.log(data); // Handle the response from the backend
        } catch (error) {
            console.error("Error sending data to backend:", error);
        }
    };




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
