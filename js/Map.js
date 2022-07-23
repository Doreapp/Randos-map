
import "./vendor/leaflet.js"

const L = window["L"]

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const CENTER = [46.6309, 2.4527]
const MARKER_CONFIG = {
    stroke: false,
    fillOpacity: 0.6,
    radius: 10,
}
const COLORS = {
    "facile": "#43a047",
    "moyen": "#ffeb3b",
    "difficile": "#e64a19",
}

/**
 * Map object
 */
export class Map {
    constructor() {
        this.map = L.map("map").setView(CENTER, 5)
        this.points = []
        this.pathes = []
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

    addPath(coordinates, color="red") {
        let polyline = L.polyline(
            coordinates,
            {color: color}
        ).addTo(this.map)
        this.map.fitBounds(polyline.getBounds())
        return polyline
    }

    addRando(rando) {
        const color = COLORS[rando.difficulte.toLowerCase()]
        let polyline = undefined, displayed=false
        let marker = L.circleMarker(
            rando.geo_point,
            {
                ...MARKER_CONFIG,
                fillColor: color
            }
        )
        marker.on("click", () => {
            if (displayed) {
                polyline.remove()
            } else if (polyline !== undefined) {
                polyline.addTo(this.map)
                this.map.fitBounds(polyline.getBounds())
            } else {
                polyline = this.addPath(rando.geo_shape.coordinates, color)
            }
            displayed = !displayed
        })
        marker.addTo(this.map)
        this.points.push(marker)
    }
}


export default { Map }