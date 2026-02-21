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
exports.getCountryGeoJSON = exports.loadCountryGeoJSON = void 0;
const axios_1 = __importDefault(require("axios"));
let countriesGeoJSON = null;
const loadCountryGeoJSON = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.get("https://datahub.io/core/geo-countries/r/0.geojson");
        countriesGeoJSON = res.data;
        console.log("✅ Country GeoJSON loaded");
    }
    catch (err) {
        console.error("❌ Failed loading GeoJSON:", err.message);
        process.exit(1);
    }
});
exports.loadCountryGeoJSON = loadCountryGeoJSON;
const getCountryGeoJSON = () => {
    if (!countriesGeoJSON) {
        throw new Error("GeoJSON not loaded yet");
    }
    return countriesGeoJSON;
};
exports.getCountryGeoJSON = getCountryGeoJSON;
