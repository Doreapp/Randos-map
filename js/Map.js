
import "./vendor/leaflet.js"

const L = window["L"]

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const CENTER = [46.6309, 2.4527]

/**
 * Map object
 */
export class Map {
    constructor() {
        this.map = L.map("map").setView(CENTER, 5)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 5,
            attribution: ATTRIBUTION,
        }).addTo(this.map)
    }
}


export default { Map }