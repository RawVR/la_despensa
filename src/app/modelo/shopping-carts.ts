import { PantryFood } from "./pantry-food";
import { User } from "./user";

export class ShoppingCart {
    public id: string;
    public description: string;
    public supermarket: string;
    public purchaseDate: Date;
    public history: boolean;
    public foods: PantryFood[];
    public users: String[];

    constructor() {
        this.purchaseDate = new Date();
        this.history = false;
        this.foods = [];
        this.users = [];
    }

    public static createFromJsonObject(jsonObject: any): ShoppingCart {
        let shoppingCart: ShoppingCart = new ShoppingCart();
        shoppingCart.id = jsonObject["id"];
        shoppingCart.description = jsonObject["description"];
        shoppingCart.supermarket = jsonObject["supermarket"];
        shoppingCart.purchaseDate = jsonObject["purchaseDate"];
        shoppingCart.history = jsonObject["history"];
        if (jsonObject["foods"] != null) {
            shoppingCart.foods = new Array<PantryFood>();
            jsonObject["users"].forEach((foodJson: any) => {
                shoppingCart.foods.push(PantryFood.createFromJsonObject(foodJson));
            });
        };
        if (jsonObject["users"] != null) {
            jsonObject["users"].forEach((userID: any) => {
                shoppingCart.users.push(userID);
            });
        };
        return shoppingCart;
    }

    public getPurchaseDate(): String {
        const date = new Date(this.purchaseDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDate;
    }
}