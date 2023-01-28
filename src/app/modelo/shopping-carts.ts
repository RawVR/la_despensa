import { Food } from "./food";

export class ShoppingCarts {
    public id: string;
    public description: string;
    public supermarket: string;
    public foods: Food[];

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): ShoppingCarts {
        let shoppingCarts: ShoppingCarts = new ShoppingCarts();
        shoppingCarts.id = jsonObject["id"];
        shoppingCarts.description = jsonObject["description"];
        shoppingCarts.supermarket = jsonObject["supermarket"];
        if (jsonObject["foods"] != null) {
            shoppingCarts.foods = new Array<Food>();
            jsonObject["users"].forEach((foodJson: any) => {
                shoppingCarts.foods.push(Food.createFromJsonObject(foodJson));
            });
        }

        return shoppingCarts;
    }
}