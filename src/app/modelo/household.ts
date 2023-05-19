import { PantryFood } from "./pantry-food";
import { PatternFood } from "./pattern-food";

export class Household {
    public id: string;
    public description: string;
    public creator: string;
    public users: string[];
    public pantries: string[];
    public categories: string[];
    public foods: PatternFood[];

    constructor() {
        this.users = [];
        this.pantries = [];
        this.categories = [];
        this.foods = [];
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
        };
        if (jsonObject["pantries"] != null && jsonObject["pantries"].length > 0) {
            household.pantries = new Array<string>();
            jsonObject["pantries"].forEach((pantryID: any) => {
                household.users.push(pantryID);
            });
        };
        if (jsonObject["categories"] != null && jsonObject["categories"].length > 0) {
            household.categories = new Array<string>();
            jsonObject["categories"].forEach((category: any) => {
                household.categories.push(category);
            });
        };
        if (jsonObject["foods"] != null && jsonObject["foods"].length > 0) {
            household.foods = new Array<PatternFood>();
            jsonObject["foods"].forEach((foodJson: any) => {
                household.foods.push(PatternFood.createFromJsonObject(foodJson));
            });
        };
        return household;
    }
}