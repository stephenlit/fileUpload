import { useState } from "react";
import { gpx } from "@tmcw/togeojson";
import {
    FeatureCollection,
    GeoJsonProperties,
    LineString,
    Feature,
} from "geojson";

const GPXViewer = () => {
    const [geoJsonData, setGeoJsonData] = useState<number[][] | null>(null);
    //const [fileName, setFileName] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        //setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result) return;
            const gpxText = e.target.result as string;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(gpxText, "application/xml");

            const geoJson: FeatureCollection = gpx(xmlDoc);
            console.log("Full GeoJSON:", geoJson); // Debugging output

            const routeCoordinates: number[][] = geoJson.features
                .filter(
                    (f): f is Feature<LineString, GeoJsonProperties> =>
                        f.geometry.type === "LineString"
                )
                .flatMap((f) => f.geometry.coordinates);

            if (routeCoordinates.length) {
                setGeoJsonData(routeCoordinates);
                sendDataToBackend(file.name, routeCoordinates);
            }
        };

        reader.readAsText(file);
    };

    const sendDataToBackend = async (
        fileName: string,
        routeCoordinates: number[][]
    ) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/upload-gpx",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fileName, route: routeCoordinates }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Server response:", data);
        } catch (error) {
            console.error("Error sending data to backend:", error);
        }
    };

    return (
        <div>
            <h1>GPX to GeoJSON Viewer</h1>
            <input
                type='file'
                accept='.gpx'
                onChange={handleFileUpload}
            />

            {geoJsonData ? (
                geoJsonData.map((coord, index) => (
                    <p key={index}>
                        {coord[0]}, {coord[1]}, {coord[2]}
                    </p>
                ))
            ) : (
                <p>Upload a GPX file to view coordinates...</p>
            )}
        </div>
    );
};

export default GPXViewer;
