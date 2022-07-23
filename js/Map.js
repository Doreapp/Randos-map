
import "./vendor/leaflet.js"

const L = window["L"]

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const CENTER = [46.6309, 2.4527]
const MARKER_CONFIG = {
    stroke: false,
    fillColor: "#155799",
    fillOpacity: 0.6,
    radius: 10,
}

/**
 * Map object
 */
export class Map {
    constructor() {
        this.map = L.map("map").setView(CENTER, 5)
        this.points = []
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 5,
            attribution: ATTRIBUTION,
        }).addTo(this.map)
    }

    addPoint(coordinates, args = {}) {
        let marker = L.circleMarker(
            coordinates,
            MARKER_CONFIG
        )
        marker.on("click", () => {
            console.log(args)
        })
        marker.addTo(this.map)
        this.points.push(marker)
    }
}


export default { Map }