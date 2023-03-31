import { UserInterface } from "./userInterface";

export class User implements UserInterface{
    public id: string;
    public email: string;
    public first_name: string;
    public last_names: string;
    public households: string[];

    constructor() {
        this.households = [];
    }

    public static createFromJsonObject(jsonObject: any): User {
        let user: User = new User();
        user.id = jsonObject["id"];
        user.email = jsonObject["email"];
        user.first_name = jsonObject["first_name"];
        user.last_names = jsonObject["last_names"];
        if (jsonObject["households"] != null) {
            user.households = new Array<string>();
            jsonObject["households"].forEach((householdID: any) => {
                user.households.push(householdID);
            });
        };
        return user;
    }
}