"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateCoords = exports.getCountryCoords = void 0;
const axios_1 = __importDefault(require("axios"));
const geojson_1 = require("../utils/geojson"); // ✅ import getter
/* ----------------------------------------
   COUNTRY POLYGON FROM LOADED GEOJSON
---------------------------------------- */
const getCountryCoords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const geoJSON = (0, geojson_1.getCountryGeoJSON)(); // ✅ FIXED
        const { countryName } = req.body;
        if (!countryName) {
            return res.status(400).json({ success: false, message: "countryName required" });
        }
        const match = geoJSON.features.find(f => {
            var _a, _b;
            const name = ((_a = f.properties) === null || _a === void 0 ? void 0 : _a.name) || ((_b = f.properties) === null || _b === void 0 ? void 0 : _b.ADMIN);
            return (name === null || name === void 0 ? void 0 : name.toLowerCase()) === countryName.toLowerCase();
        });
        if (!match) {
            return res.status(404).json({ success: false, message: "Country not found" });
        }
        const { type, coordinates } = match.geometry;
        const polygons = [];
        if (type === "Polygon") {
            coordinates.forEach((ring) => {
                polygons.push(ring.map(([lng, lat]) => ({ lat, lng })));
            });
        }
        if (type === "MultiPolygon") {
            coordinates.forEach((poly) => {
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
    }
    catch (error) {
        console.error("CountryCoords error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getCountryCoords = getCountryCoords;
/* ----------------------------------------
   STATE POLYGON FROM OPENSTREETMAP
---------------------------------------- */
const getStateCoords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stateName, countryName } = req.body;
    if (!stateName || !countryName) {
        return res.status(400).json({
            success: false,
            message: "stateName & countryName required"
        });
    }
    try {
        const url = `https://nominatim.openstreetmap.org/search?state=${encodeURIComponent(stateName)}&country=${encodeURIComponent(countryName)}&format=json&polygon_geojson=1`;
        const response = yield axios_1.default.get(url, {
            headers: { "User-Agent": "GeofenceApp/1.0" }
        });
        const result = response.data.find((r) => r.geojson);
        if (!result) {
            return res.status(404).json({ success: false, message: "State polygon not found" });
        }
        const { type, coordinates } = result.geojson;
        const polygons = [];
        if (type === "Polygon") {
            coordinates.forEach((ring) => {
                polygons.push(ring.map(([lng, lat]) => ({ lat, lng })));
            });
        }
        if (type === "MultiPolygon") {
            coordinates.forEach((poly) => {
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
    }
    catch (error) {
        console.error("StateCoords error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch state polygon" });
    }
});
exports.getStateCoords = getStateCoords;
