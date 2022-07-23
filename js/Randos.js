export class GeoShape {
    constructor (coordinates=[]) {
        this.coordinates = coordinates
    }
}

export class Rando {
    constructor (args={}) {
        this.length_linear = args.fields.lineaire
        this.geo_point = args.fields.geo_point_2d
        this.category = args.fields.cat
        this.type_ffrp = args.fields.type_ffrp
        this.commune = args.fields.commune
        this.difficulte = args.fields.difficulte
        this.published = args.fields.published
        this.geo_shape = new GeoShape(args.fields.geo_shape.coordinates)
    }
}

export async function loadRandos() {
    let response = await fetch("../data/randos.json")
    let data = await response.json()
    let result = []
    for (let rawRando of data) {
        result.push(new Rando(rawRando))
    }
    return result
}

export default { GeoShape, Rando }