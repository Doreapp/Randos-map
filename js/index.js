import { Map } from "./Map.js";
import { loadRandos } from "./Randos.js"

function buildMap() {
    return new Map()
}

function displayRandos(map, randos) {
    /* Use to display every randos' positions
    for (let rando of randos) {
        rando.addTo(map)
    } */
    let coords = randos[0].geo_shape.coordinates
    console.log(coords)
    map.addPath(coords)
}

function main() {
    let map = buildMap()
    loadRandos()
        .then(randos => {
            console.log(randos.length + " randos loaded succesfully")
            displayRandos(map, randos)
        })
        .catch(err => {
            console.warn("Error loading randos", err)
        })
}

main()