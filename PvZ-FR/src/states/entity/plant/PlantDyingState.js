import State from "../../../../lib/State.js";

export default class PlantDyingState extends State {
    constructor(plant) {
        super()

        this.plant = plant
    }

    enter() {
        this.plant.remove()
    }
}