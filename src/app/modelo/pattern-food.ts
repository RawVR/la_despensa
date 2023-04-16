import { PantryFood } from "./pantry-food";

export class PatternFood {
    public name: string;
    public category: string;
    public barCode: string;
    public tags: string[]

    constructor() {
        this.tags = [];
    }

    public static createFromJsonObject(jsonObject: any): PatternFood {
        let food: PatternFood = new PatternFood();
        food.name = jsonObject["name"],
        food.category = jsonObject["category"],
        food.barCode = jsonObject["barCode"]
        if (jsonObject["tags"] != null) {
            food.tags = new Array<string>();
            jsonObject["tags"].forEach((tag: any) => {
                food.tags.push(tag);
            });
        };
        return food;
    }

    public setDataFromPantryFood(pantryFood: PantryFood) {
        this.name = pantryFood.name;
        this.category = pantryFood.category;
        this.barCode = pantryFood.barCode;
        this.tags = pantryFood.tags;
    }
}