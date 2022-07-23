import { Map } from "./Map.js";
import { loadRandos } from "./Randos.js"

function buildMap() {
    let map = new Map()
}

function main() {
    buildMap()
    loadRandos()
        .then(randos => {
            console.log(randos.length)
            console.log(randos)
        })
        .catch(err => {
            console.warn("Error loading randos", err)
        })
}

main()