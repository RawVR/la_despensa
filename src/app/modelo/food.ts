export class Food {
    public name: string;
    public description: string;
    public quantity: number;
    public category: string;
    public expiration: Date;
    public barCode: string;
    public tags: string[]

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Food {
        let food: Food = new Food();
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
        }

        return food;
    }

    public getCaducidad() {
        return this.expiration;
    }
}