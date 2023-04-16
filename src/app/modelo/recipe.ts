import { PantryFood } from "./pantry-food";


export class Recipe {
    public id: string;
    public description: string;
    public ingredients: PantryFood[];

    constructor() {
        this.ingredients = [];
    }

    public static createFromJsonObject(jsonObject: any): Recipe {
        let recipe: Recipe = new Recipe();
        recipe.id = jsonObject["id"];
        recipe.description = jsonObject["description"];
        if (jsonObject["ingredients"] != null) {
            recipe.ingredients = new Array<PantryFood>();
            jsonObject["ingredients"].forEach((pantryFoodJson: any) => {
                recipe.ingredients.push(PantryFood.createFromJsonObject(pantryFoodJson));
            });
        };
        return recipe;
    }
}