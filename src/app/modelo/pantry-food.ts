import { PatternFood } from "./pattern-food";

export class PantryFood extends PatternFood {
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
        food.expiration = convertStringToDate(jsonObject["expiration"]),
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

function convertStringToDate(dateString: any): Date {
    try {
        const parts = dateString.split("T");
        const datePart = parts[0];
        const timePart = parts[1].split(".")[0];
        const dateParts = datePart.split("-");
        const timeParts = timePart.split(":");

        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);

        return new Date(year, month, day, hours, minutes);
    } catch (error) {
        console.log("Error: " + error);
    }

    return null;
}
