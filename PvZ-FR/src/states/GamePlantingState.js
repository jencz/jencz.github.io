import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, images } from "../globals.js";
import Level from "../objects/Level.js";
import PlantType from "../enums/PlantType.js"
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Vector from "../../lib/Vector.js";
import Plant from "../entities/Plants/Plant.js";
import Walnut from "../entities/Plants/Walnut.js";
import Spikeweed from "../entities/Plants/Spikeweed.js";
import Cherrybomb from "../entities/Plants/Cherrybomb.js";
import PotatoMine from "../entities/Plants/PotatoMine.js";
import PlantFactory from "../services/PlantFactory.js";

export default class GamePlantingState extends State {
    constructor(plantType, level) {
        super();

        this.level = level

        this.sprite = null;

        this.width = null;
        this.height = null;

        if (plantType === PlantType.Walnut) {
            this.plant = new Walnut(this.level)
        }
        else if (plantType === PlantType.Spikeweed) {
            this.plant = new Spikeweed(this.level)
        }
        else if (plantType === PlantType.CherryBomb) {
            this.plant = new Cherrybomb(this.level)
        }
        else if (plantType === PlantType.PotatoMine) {
            this.plant = new PotatoMine(this.level)
        }

        this.plant = PlantFactory.createInstance(plantType, level)
    }

    enter() {

    }

    update(dt) {
        this.plant.update(dt)
    }

    render() {
        this.renderDarkOverlay()

        let disableAllButton = true
        this.level.bottomBarMenu.render(disableAllButton)

        context.save()

        this.plant.render();

        context.restore()
    }

    renderDarkOverlay() {
        context.save()
        context.fillStyle = 'rgb(0, 0, 0, 0.30)';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - Level.BOTTOM_BAR_HEIGHT);
        context.restore()
    }
}
