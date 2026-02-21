import { Router } from "express";
import { getCountryCoords, getStateCoords } from "../controllers/geo.controller";

const geoRoutes=Router()

geoRoutes.post("/country",getCountryCoords)

geoRoutes.post("/state",getStateCoords)
export default geoRoutes