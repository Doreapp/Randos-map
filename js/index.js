import { Map } from "./Map.js";
import { loadRandos } from "./Randos.js"

function buildMap() {
    return new Map()
}

function displayRandos(map, randos) {
    for (let rando of randos) {
        map.addRando(rando)
    }
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