import { Food } from "./food";

export class Household {
    public id: string;
    public description: string;
    public creator: string;
    public users: string[];
    public pantries: string[];
    public foods: Food[];

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Household {
        let household: Household = new Household();
        household.id = jsonObject["id"];
        household.description = jsonObject["description"];
        household.creator = jsonObject["creator"];
        if (jsonObject["users"] != null) {
            household.users = new Array<string>();
            jsonObject["users"].forEach((userID: any) => {
                household.users.push(userID);
            });
        }
        if (jsonObject["pantries"] != null) {
            household.pantries = new Array<string>();
            jsonObject["pantries"].forEach((pantryID: any) => {
                household.users.push(pantryID);
            });
        }
        if (jsonObject["foods"] != null) {
            household.foods = new Array<Food>();
            jsonObject["foods"].forEach((foodJson: any) => {
                household.foods.push(Food.createFromJsonObject(foodJson));
            });
        }
        return household;
    }
}