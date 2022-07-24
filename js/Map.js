
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
        this.map.on('locationfound', e => this.onLocationFound(e))
        this.map.locate({ setView: false, maxZoom: 16 })
        this.markers = new L.FeatureGroup()
        this.map.addLayer(this.markers)
        this.pathes = []
    }

    addPoint(coordinates, args = {}) {
        let marker = L.circleMarker(
            coordinates,
            MARKER_CONFIG
        )
        marker.on("click", () => {
            console.log(args)
        })
        marker.addTo(this.markers)
    }

    addPath(coordinates, color = "red") {
        let polyline = L.polyline(
            coordinates,
            { color: color }
        ).addTo(this.map)
        this.map.fitBounds(polyline.getBounds())
        this.pathes.push(polyline)
        return polyline
    }

    changeRandoFocus(rando) {
        if (rando._ === undefined) {
            return
        }
        if (rando._.displayed) {
            rando._.polyline.remove()
            this.info.update()
        } else {
            if (rando._.polyline !== undefined) {
                rando._.polyline.addTo(this.map)
                this.map.fitBounds(rando._.polyline.getBounds())
            } else {
                rando._.polyline = this.addPath(rando.geo_shape.coordinates, rando._.color)
            }
            this.info.update(rando.props)
            if (window.onRandoClicked !== undefined) {
                window.onRandoClicked(rando)
            }
        }
        rando._.displayed = !rando._.displayed
    }

    addRando(rando) {
        rando._ = {}
        rando._.color = COLORS[rando.difficulte.toLowerCase()]
        rando._.polyline = undefined
        rando._.displayed = false
        rando._.marker = L.circleMarker(
            rando.geo_point,
            {
                ...MARKER_CONFIG,
                fillColor: rando._.color
            }
        )
        rando._.marker.on("click", () => {
            this.changeRandoFocus(rando)
        })
        rando._.marker.addTo(this.markers)
    }

    onLocationFound(e) {
        L.circle(e.latlng, e.accuracy).addTo(this.map)
    }

    clear() {
        this.markers.clearLayers()
        this.pathes.forEach(path => path.remove())
    }
}


export default { Map }