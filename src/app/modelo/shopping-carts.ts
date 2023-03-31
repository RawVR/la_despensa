import { Food } from "./food";

export class ShoppingCart {
    public id: string;
    public description: string;
    public supermarket: string;
    public foods: Food[];

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): ShoppingCart {
        let shoppingCart: ShoppingCart = new ShoppingCart();
        shoppingCart.id = jsonObject["id"];
        shoppingCart.description = jsonObject["description"];
        shoppingCart.supermarket = jsonObject["supermarket"];
        if (jsonObject["foods"] != null) {
            shoppingCart.foods = new Array<Food>();
            jsonObject["users"].forEach((foodJson: any) => {
                shoppingCart.foods.push(Food.createFromJsonObject(foodJson));
            });
        }

        return shoppingCart;
    }
}