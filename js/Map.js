
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
 * Create an info element to display on the top right of the map
 * @param {string} title Title of the info element, undefined to use none
 * @returns The created info element. Use ``info.addTo(map)``.
 */
function createInfoElement() {
    let info = L.control()
    info.onAdd = function () {
        this._div = L.DomUtil.create("div", "info")
        this.update()
        return this._div
    }
    info.update = function (props) {
        let html = ""
        if (props) {
            for (let title in props) {
                html += title + ": " + props[title] + "<br />"
            }
        } else {
            html += "Cliquer sur un point"
        }
        this._div.innerHTML = html
    }
    return info
}

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
        this.info = createInfoElement()
        this.info.addTo(this.map)
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
    }

    addPath(coordinates, color = "red") {
        let polyline = L.polyline(
            coordinates,
            { color: color }
        ).addTo(this.map)
        this.map.fitBounds(polyline.getBounds())
        return polyline
    }

    addRando(rando) {
        const color = COLORS[rando.difficulte.toLowerCase()]
        let polyline = undefined, displayed = false
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
            } else {
                if (polyline !== undefined) {
                    polyline.addTo(this.map)
                    this.map.fitBounds(polyline.getBounds())
                } else {
                    polyline = this.addPath(rando.geo_shape.coordinates, color)
                }
                this.info.update(rando.props)
            }
            displayed = !displayed
        })
        marker.addTo(this.map)
    }
}


export default { Map }