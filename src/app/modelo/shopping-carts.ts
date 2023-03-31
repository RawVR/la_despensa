import { Food } from "./food";
import { User } from "./user";

export class ShoppingCart {
    public id: string;
    public description: string;
    public supermarket: string;
    public history: boolean;
    public foods: Food[];
    public users: Set<String>;

    constructor() {
        this.history = false;
        this.foods = [];
    }

    public static createFromJsonObject(jsonObject: any): ShoppingCart {
        let shoppingCart: ShoppingCart = new ShoppingCart();
        shoppingCart.id = jsonObject["id"];
        shoppingCart.description = jsonObject["description"];
        shoppingCart.supermarket = jsonObject["supermarket"];
        shoppingCart.history = false;
        if (jsonObject["foods"] != null) {
            shoppingCart.foods = new Array<Food>();
            jsonObject["users"].forEach((foodJson: any) => {
                shoppingCart.foods.push(Food.createFromJsonObject(foodJson));
            });
        };
        if (jsonObject["users"] != null) {
            jsonObject["users"].forEach((userID: any) => {
                shoppingCart.users.add(userID);
            });
        };
        return shoppingCart;
    }
}