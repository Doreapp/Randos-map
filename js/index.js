import { Map } from "./Map.js";
import { loadRandos } from "./Randos.js"

var store = {}

function buildMap() {
    return new Map()
}

function filterRandos() {
    if (store.randos === undefined)
        return // Abort
    let minDuration = store.filters.minDuration.value
    let maxDuration = store.filters.maxDuration.value
    let minLength = store.filters.minLength.value
    let maxLength = store.filters.maxLength.value
    let balisageRequired = store.filters.balisage.checked
    let filteredRandos = store.randos.filter(rando => {
        if (balisageRequired && rando.balisage === undefined)
            return false
        return (rando.length_linear >= minLength && rando.length_linear <= maxLength &&
            rando.duree >= minDuration && rando.duree <= maxDuration)
    })
    store.map.clear()
    displayRandos(filteredRandos)
}

function setupFilters() {
    let filters = {}
    for (let element of document.querySelectorAll("input")) {
        filters[element.id] = element
        element.onchange = (e) => {
            console.log("on change", e.target.value)
            filterRandos()
        }
    }
    store.filters = filters
}

function displayRandos(randos) {
    if (store.map === undefined) {
        throw new Error("Values in store are undefined")
    }
    for (let rando of randos) {
        store.map.addRando(rando)
    }
    let url = window.location.href
    let index = url.indexOf("?")
    if (index >= 0) {
        let id = url.substring(index + "?id=".length)
        let matching = randos.filter(rando => rando.id == id)
        if (matching.length == 1) {
            store.map.changeRandoFocus(matching[0])
        }
    }
}

function initListeners() {
    window.onRandoClicked = (rando) => {
        let url = window.location.href
        let index = url.indexOf("?")
        if (index >= 0) {
            url = url.substring(0, index)
        }
        url += "?id=" + rando.id
        window.history.pushState({}, document.title, url)
    }
}

function main() {
    setupFilters()
    initListeners()
    store.map = buildMap()
    loadRandos()
        .then(randos => {
            console.log(randos.length + " randos loaded succesfully")
            store.randos = randos
            displayRandos(randos)
        })
        .catch(err => {
            console.warn("Error loading randos", err)
        })
}

main()
