import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Household } from 'src/app/modelo/household';
import { User } from 'src/app/modelo/user';
import { Pantry } from 'src/app/modelo/pantry';
import { ShoppingCart } from 'src/app/modelo/shopping-carts';


@Injectable({
    providedIn: 'root',
})
export class FireServiceProvider {


    constructor(private angularFirestore: AngularFirestore) {
    }

    //#region Users
    getUser(uid: string): Promise<User> {
        let promise = new Promise<User>((resolve, reject) => {
            const usuarioRef = this.angularFirestore.collection("users").ref.doc(uid).get().then((data: any) => {
                if (data.exists) {
                    let usuarioJson = data.data();
                    let usuario = User.createFromJsonObject(usuarioJson);
                    resolve(usuario);
                }
            }).catch((error: Error) => {
                reject(error.message);
            });
        });
        return promise;
    }

    createUser(dataNewUser: User): Promise<User> {
        let promise = new Promise<User>((resolve, reject) => {
            this.angularFirestore.collection("users").ref.doc(dataNewUser.id).set(JSON.parse(JSON.stringify(dataNewUser)))
                .then(() => {
                    resolve(dataNewUser);
                })
                .catch((error: Error) => {
                    reject(error.message);
                })
        });
        return promise;
    }

    updateUser(dataModifyUser: User): Promise<User> {
        let promise = new Promise<User>((resolve, reject) => {
            this.angularFirestore.collection("users").doc(dataModifyUser.id).update(JSON.parse(JSON.stringify(dataModifyUser)))
                .then(() => {
                    resolve(dataModifyUser);
                })
                .catch((error: Error) => {
                    reject(error.message);
                })
        });
        return promise;
    }
    //#endregion

    //#region Households
    getHousehold(uid: string): Promise<Household> {
        let promise = new Promise<Household>((resolve, reject) => {
            const householdRef = this.angularFirestore.collection("households").ref.doc(uid).get().then((data: any) => {
                if (data.exists) {
                    let householdJson = data.data();
                    let household = Household.createFromJsonObject(householdJson);
                    resolve(household);
                }
            }).catch((error: Error) => {
                reject(error.message);
            });
        });
        return promise;
    }

    async getHouseholds(userID: string): Promise<Household[]> {
        let promise = new Promise<Household[]>(async (resolve, reject) => {
            const householdsRef = this.angularFirestore.collection('households');
            const snapshot = await householdsRef.ref.where('users', 'array-contains', userID).get()
                .then((data: any) => {
                    let households = new Array<Household>();
                    data.forEach((element: { data: () => any; }) => {
                        let householdJson = element.data();
                        let household = Household.createFromJsonObject(householdJson);
                        households.push(household);
                    });
                    resolve(households);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    deleteHousehold(creatorID: any, householdID: any): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.getHousehold(householdID).then((household) => {
                if (household.creator === creatorID) {
                    this.angularFirestore.collection('households').doc(householdID).delete().then(
                        (data: any) => {
                            let user = this.getUser(creatorID).then((user) => {
                                let index = user.households.indexOf(householdID);
                                user.households.splice(index, 1);
                                this.updateUser(user);
                            });
                            console.log(data)
                            resolve(true);
                        })
                        .catch((error: Error) => {
                            console.log(error.message);
                            reject(error.message);
                        });
                }
            })
                .catch((error: Error) => {
                    console.log(error.message);
                    reject(error.message);
                });
        });
        return promise;
    }

    unlinkHousehold(creatorID: any, householdID: any): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.getHousehold(householdID).then((household) => {
                if (household.creator != creatorID) {
                    let household = this.getHousehold(householdID).then((household) => {
                        let index = household.users.indexOf(householdID);
                        household.users.splice(index, 1);
                        this.updateHousehold(household);
                    });
                    resolve(true);
                }
            })
                .catch((error: Error) => {
                    console.log(error.message);
                    reject(error.message);
                });
        });
        return promise;
    }

    insertHousehold(dataNewHousehold: Household): Promise<Household> {
        let promise = new Promise<Household>((resolve, reject) => {
            dataNewHousehold.id = this.angularFirestore.collection("households").ref.doc().id;
            this.angularFirestore.collection("households").doc(dataNewHousehold.id)
                .set(JSON.parse(JSON.stringify(dataNewHousehold)))
                .then(() => {
                    let user = this.getUser(dataNewHousehold.creator)
                        .then((user: User) => {
                            user.households.push(dataNewHousehold.id);
                            this.updateUser(user);
                        })
                        .catch((error: Error) => {
                            reject(error.message);
                        });
                    resolve(dataNewHousehold);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    updateHousehold(dataModifyHousehold: Household): Promise<Household> {
        let promise = new Promise<Household>((resolve, reject) => {
            this.angularFirestore.collection("households").doc(dataModifyHousehold.id).update(JSON.parse(JSON.stringify(dataModifyHousehold)))
                .then(() => {
                    resolve(dataModifyHousehold);
                })
                .catch((error: Error) => {
                    reject(error.message);
                })
        });
        return promise;
    }
    //#endregion

    //#region Pantries
    getPantry(pantryID: string): Promise<Pantry> {
        let promise = new Promise<Pantry>((resolve, reject) => {
            const pantryRef = this.angularFirestore.collection("pantries").ref.doc(pantryID).get().then((data: any) => {
                if (data.exists) {
                    let pantryJson = data.data();
                    let pantry = Pantry.createFromJsonObject(pantryJson);
                    resolve(pantry);
                }
            }).catch((error: Error) => {
                reject(error.message);
            });
        });
        return promise;
    }

    async getPantries(householdID: string): Promise<Pantry[]> {
        let promise = new Promise<Pantry[]>(async (resolve, reject) => {
            const pantriesRef = this.angularFirestore.collection('pantries');
            const snapshot = await pantriesRef.ref.where('household', '==', householdID).get()
                .then((data: any) => {
                    let pantries = new Array<Pantry>();
                    data.forEach((element: { data: () => any; }) => {
                        let pantryJson = element.data();
                        let pantry = Pantry.createFromJsonObject(pantryJson);
                        pantries.push(pantry);
                    });
                    resolve(pantries);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    insertPantry(dataNewPantry: Pantry): Promise<Pantry> {
        let promise = new Promise<Pantry>((resolve, reject) => {
            dataNewPantry.id = this.angularFirestore.collection("pantries").ref.doc().id;
            this.angularFirestore.collection("pantries").doc(dataNewPantry.id)
                .set(JSON.parse(JSON.stringify(dataNewPantry)))
                .then(() => {
                    let household = this.getHousehold(dataNewPantry.id)
                        .then((household: Household) => {
                            household.pantries.push(dataNewPantry.id);
                            this.updateHousehold(household);
                        })
                        .catch((error: Error) => {
                            reject(error.message);
                        });
                    resolve(dataNewPantry);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    deletePantry(pantryID: any): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('pantries').doc(pantryID).delete().then(
                (data: any) => {
                    console.log(data)
                    resolve(true);
                })
                .catch((error: Error) => {
                    console.log(error.message);
                    reject(error.message);
                });
        });
        return promise;
    }

    updatePantry(dataModifyPantry: Pantry): Promise<Pantry> {
        let promise = new Promise<Pantry>((resolve, reject) => {
            this.angularFirestore.collection("pantries").doc(dataModifyPantry.id).update(JSON.parse(JSON.stringify(dataModifyPantry)))
                .then(() => {
                    resolve(dataModifyPantry);
                })
                .catch((error: Error) => {
                    reject(error.message);
                })
        });
        return promise;
    }
    //#endregion

    //#region ShoppingCarts
    getShoppingCart(ShoppingCartID: string): Promise<ShoppingCart> {
        let promise = new Promise<ShoppingCart>((resolve, reject) => {
            const shoppingCartRef = this.angularFirestore.collection("shoppingCart").ref.doc(ShoppingCartID).get().then((data: any) => {
                if (data.exists) {
                    let shoppingCartJson = data.data();
                    let shoppingCart = ShoppingCart.createFromJsonObject(shoppingCartJson);
                    resolve(shoppingCart);
                }
            }).catch((error: Error) => {
                reject(error.message);
            });
        });
        return promise;
    }

    async getShoppingCarts(ShoppingCartID: string): Promise<ShoppingCart[]> {
        let promise = new Promise<ShoppingCart[]>(async (resolve, reject) => {
            const shoppingCartRef = this.angularFirestore.collection('shoppingCart');
            const snapshot = await shoppingCartRef.ref.where('shoppingCart', '==', ShoppingCartID).get()
                .then((data: any) => {
                    let shoppingCarts = new Array<ShoppingCart>();
                    data.forEach((element: { data: () => any; }) => {
                        let shoppingCartJson = element.data();
                        let shoppingCart = ShoppingCart.createFromJsonObject(shoppingCartJson);
                        shoppingCarts.push(shoppingCart);
                    });
                    resolve(shoppingCarts);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    insertShoppingCart(dataNewShoppingCart: ShoppingCart): Promise<ShoppingCart> {
        let promise = new Promise<ShoppingCart>((resolve, reject) => {
            dataNewShoppingCart.id = this.angularFirestore.collection("shoppingCarts").ref.doc().id;
            this.angularFirestore.collection("shoppingCarts").doc(dataNewShoppingCart.id)
                .set(JSON.parse(JSON.stringify(dataNewShoppingCart)))
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    deleteShoppingCart(shoppingCartID: any): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('shoppingCarts').doc(shoppingCartID).delete().then(
                (data: any) => {
                    console.log(data)
                    resolve(true);
                })
                .catch((error: Error) => {
                    console.log(error.message);
                    reject(error.message);
                });
        });
        return promise;
    }

    shoppingCartPurchased(dataShoppingCart: ShoppingCart): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.deleteShoppingCart(dataShoppingCart.id)
                .then(async (deleted) => {
                    this.insertShoppingCartHistory(dataShoppingCart);
                });
        });
        return promise;
    }

    getShoppingCartHistory(ShoppingCartID: string): Promise<ShoppingCart> {
        let promise = new Promise<ShoppingCart>((resolve, reject) => {
            const shoppingCartRef = this.angularFirestore.collection("shoppingCartHistory").ref.doc(ShoppingCartID).get().then((data: any) => {
                if (data.exists) {
                    let shoppingCartJson = data.data();
                    let shoppingCart = ShoppingCart.createFromJsonObject(shoppingCartJson);
                    resolve(shoppingCart);
                }
            }).catch((error: Error) => {
                reject(error.message);
            });
        });
        return promise;
    }

    async getShoppingCartsHistory(ShoppingCartID: string): Promise<ShoppingCart[]> {
        let promise = new Promise<ShoppingCart[]>(async (resolve, reject) => {
            const shoppingCartRef = this.angularFirestore.collection('shoppingCartHistory');
            const snapshot = await shoppingCartRef.ref.where('shoppingCart', '==', ShoppingCartID).get()
                .then((data: any) => {
                    let shoppingCarts = new Array<ShoppingCart>();
                    data.forEach((element: { data: () => any; }) => {
                        let shoppingCartJson = element.data();
                        let shoppingCart = ShoppingCart.createFromJsonObject(shoppingCartJson);
                        shoppingCarts.push(shoppingCart);
                    });
                    resolve(shoppingCarts);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    insertShoppingCartHistory(dataNewShoppingCart: ShoppingCart): Promise<ShoppingCart> {
        let promise = new Promise<ShoppingCart>((resolve, reject) => {
            this.angularFirestore.collection("shoppingCartHistory").doc(dataNewShoppingCart.id)
                .set(JSON.parse(JSON.stringify(dataNewShoppingCart)))
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }

    deleteShoppingCartHistory(shoppingCartID: any): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('shoppingCartHistory').doc(shoppingCartID).delete().then(
                (data: any) => {
                    console.log(data)
                    resolve(true);
                })
                .catch((error: Error) => {
                    console.log(error.message);
                    reject(error.message);
                });
        });
        return promise;
    }
    //#endregion
}