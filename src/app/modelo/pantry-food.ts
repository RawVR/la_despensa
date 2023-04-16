import { PatternFood } from "./pattern-food";

export class PantryFood extends PatternFood{
    public description: string;
    public quantity: number;
    public expiration: Date;

    constructor() {
        super();
    }

    public static override createFromJsonObject(jsonObject: any): PantryFood {
        let food: PantryFood = new PantryFood();
        food.name = jsonObject["name"],
        food.description = jsonObject["description"],
        food.quantity = jsonObject["quantity"],
        food.category = jsonObject["category"],
        food.expiration = jsonObject["expiration"],
        food.barCode = jsonObject["barCode"]
        if (jsonObject["tags"] != null) {
            food.tags = new Array<string>();
            jsonObject["tags"].forEach((tag: any) => {
                food.tags.push(tag);
            });
        };
        return food;
    }

    public getCaducidad() {
        return this.expiration;
    }
}