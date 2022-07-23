
export class GeoShape {
    constructor (coordinates=[]) {
        this.coordinates = coordinates.map(
            coor => [coor[1], coor[0]]
        )
    }
}

function toHourString(num) {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return `${hours}h${minutes < 10 ? "0" + minutes : minutes}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addIfDefined(dict, name, value) {
    if (value !== undefined) {
        dict[name] = value
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
        this.alias = args.fields.alias
        this.balisage = args.fields.itibalisage
        this.type = args.fields.carac
        this.duree = args.fields.duree
        this.descriptifsynthetique = args.fields.descriptifsynthetique
        this.descriptif = args.fields.descriptif
        this.denivele_neg = args.fields.itideniveledescente
        this.denivele_pos = args.fields.itidenivelemontee
    }

    get props() {
        let result = {}
        addIfDefined(result, "Nom", this.alias)
        if (this.length_linear !== undefined) {
            result["Taille"] = this.length_linear.toFixed(2) + " km"
        }
        addIfDefined(result, "Difficulté", this.difficulte)
        if (this.duree !== undefined) {
            result["Durée"] = toHourString(this.duree)
        }
        addIfDefined(result, "Balisage", this.balisage)
        addIfDefined(result, "Dénivelé positif (D+)", this.denivele_pos)
        addIfDefined(result, "Dénivelé négatif (D-)", this.denivele_neg)
        addIfDefined(result, "Balisage", this.balisage)
        addIfDefined(result, "Catégorie", this.category)
        addIfDefined(result, "Type", this.type)
        if (this.commune !== undefined) {
            result["Commune"] =  capitalizeFirstLetter(this.commune.toLowerCase())
        }
        addIfDefined(result, "Résumé", this.descriptifsynthetique)
        return result
    }

    addTo(map) {
        map.addPoint(this.geo_point, this)
    }
}

export async function loadRandos() {
    let response = await fetch("./data/randos.json")
    let data = await response.json()
    let result = []
    for (let rawRando of data) {
        result.push(new Rando(rawRando))
    }
    return result
}

export default { GeoShape, Rando }