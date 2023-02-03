import { Injectable } from '@angular/core';
import { UserFirebase } from 'src/app/modelo/user-firebase';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import * as auth from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FireServiceProvider } from './fire-service';
import { User } from 'src/app/modelo/user';

@Injectable({
    providedIn: 'root',
})
export class FirebaseAuthService {
    public user: Observable<UserFirebase | null | undefined>;

    constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore,
        private firebaseService: FireServiceProvider) {
        this.user = this.afAuth.authState.pipe(
            switchMap((user) => {
                if (user) {
                    return this.afs.doc<UserFirebase>(`users/${user.uid}`).valueChanges();
                }
                return of(null);
            })
        );
    }

    async signUp(email: string, password: string): Promise<any> {
        try {
            this.afAuth.createUserWithEmailAndPassword(email, password)
                .then(async () => {
                    await this.afAuth.currentUser.then((user) => {
                        let userUID = user?.uid;
                        if (userUID != null) {
                            let usuario = new User();
                            usuario.id = userUID;
                            usuario.email = email;
                            this.firebaseService.createUser(usuario);
                        }
                        user?.sendEmailVerification();
                        return user;
                    });
                });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async logInUser(email: string, password: string): Promise<any> {
        try {
            const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
            return user;
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async logInUserGoogle(): Promise<any> {
        try {
            const { user } = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
            if (user){
                localStorage.setItem('user.id', user.uid);
            }
            return user;
        } catch (error) {
            console.log('Error:', error);
        }
    }

    isEmailVerified(user: UserFirebase): boolean {
        return user.emailVerified === true ? true : false;
    }

    async logOutUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (await this.afAuth.currentUser) {
                this.afAuth.signOut()
                    .then(() => {
                        console.log("Logout");
                        resolve(null);
                    }).catch((error) => {
                        reject();
                    });
            }
        })
    }

    userDetails() {
        return this.afAuth.user;
    }
}