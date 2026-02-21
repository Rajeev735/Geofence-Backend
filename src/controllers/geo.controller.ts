import { Request, Response } from "express";
import axios from "axios";
import { getCountryGeoJSON } from "../utils/geojson";   // ✅ import getter

interface GeoPoint {
  lat: number;
  lng: number;
}

interface GeoJSONGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: any;
}

interface GeoJSONFeature {
  properties: {
    name?: string;
    ADMIN?: string;
  };
  geometry: GeoJSONGeometry;
}

interface GeoJSONData {
  features: GeoJSONFeature[];
}

/* ----------------------------------------
   COUNTRY POLYGON FROM LOADED GEOJSON
---------------------------------------- */

export const getCountryCoords = async (req: Request, res: Response) => {
  try {
    const geoJSON = getCountryGeoJSON() as GeoJSONData;   // ✅ FIXED

    const { countryName } = req.body as { countryName: string };

    if (!countryName) {
      return res.status(400).json({ success: false, message: "countryName required" });
    }

    const match = geoJSON.features.find(f => {
      const name = f.properties?.name || f.properties?.ADMIN;
      return name?.toLowerCase() === countryName.toLowerCase();
    });

    if (!match) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }

    const { type, coordinates } = match.geometry;

    const polygons: GeoPoint[][] = [];

    if (type === "Polygon") {
      coordinates.forEach((ring: number[][]) => {
        polygons.push(ring.map(([lng, lat]) => ({ lat, lng })));
      });
    }

    if (type === "MultiPolygon") {
      coordinates.forEach((poly: number[][][]) => {
        poly.forEach((ring) => {
          polygons.push(ring.map(([lng, lat]) => ({ lat, lng })));
        });
      });
    }

    res.json({
      success: true,
      country: countryName,
      type,
      polygons
    });
  } catch (error) {
    console.error("CountryCoords error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ----------------------------------------
   STATE POLYGON FROM OPENSTREETMAP
---------------------------------------- */

export const getStateCoords = async (req: Request, res: Response) => {
  const { stateName, countryName } = req.body as {
    stateName: string;
    countryName: string;
  };

  if (!stateName || !countryName) {
    return res.status(400).json({
      success: false,
      message: "stateName & countryName required"
    });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?state=${encodeURIComponent(
      stateName
    )}&country=${encodeURIComponent(
      countryName
    )}&format=json&polygon_geojson=1`;

    const response = await axios.get(url, {
      headers: { "User-Agent": "GeofenceApp/1.0" }
    });

    const result = response.data.find((r: any) => r.geojson);

    if (!result) {
      return res.status(404).json({ success: false, message: "State polygon not found" });
    }

    const { type, coordinates } = result.geojson;

    const polygons: GeoPoint[][] = [];

    if (type === "Polygon") {
      coordinates.forEach((ring: number[][]) => {
        polygons.push(ring.map(([lng, lat]) => ({ lat, lng })));
      });
    }

    if (type === "MultiPolygon") {
      coordinates.forEach((poly: number[][][]) => {
        poly.forEach((ring) => {
          polygons.push(ring.map(([lng, lat]) => ({ lat, lng })));
        });
      });
    }

    res.json({
      success: true,
      state: stateName,
      country: countryName,
      type,
      polygons
    });
  } catch (error: any) {
    console.error("StateCoords error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch state polygon" });
  }
};
