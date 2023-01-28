import { Food } from "./food";

export class Pantry {
    public id: string;
    public description: string;
    public household: string;
    public type: string;
    public foods: Food[];

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Pantry {
        let pantry: Pantry = new Pantry();
        pantry.id = jsonObject["id"];
        pantry.description = jsonObject["description"];
        pantry.household = jsonObject["household"];
        pantry.type = jsonObject["type"];
        if (jsonObject["foods"] != null) {
            pantry.foods = new Array<Food>();
            jsonObject["foods"].forEach((foodJson: any) => {
                pantry.foods.push(Food.createFromJsonObject(foodJson));
            });
        }

        return pantry;
    }
}