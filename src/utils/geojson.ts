import axios from "axios";

let countriesGeoJSON: any = null;

export const loadCountryGeoJSON = async () => {
  try {
    const res = await axios.get(
      "https://datahub.io/core/geo-countries/r/0.geojson"
    );

    countriesGeoJSON = res.data;
    console.log("✅ Country GeoJSON loaded");
  } catch (err: any) {
    console.error("❌ Failed loading GeoJSON:", err.message);
    process.exit(1);
  }
};

export const getCountryGeoJSON = () => {
  if (!countriesGeoJSON) {
    throw new Error("GeoJSON not loaded yet");
  }
  return countriesGeoJSON;
};
