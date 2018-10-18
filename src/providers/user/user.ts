import {Injectable} from '@angular/core';
import {User} from "../../models/user";
import { Storage } from '@ionic/storage';
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';

/*
 Generated class for the UserProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class UserProvider {

  private _user:User = new User();
  private _status:Number = 0;

  constructor(private nativeStorage : Storage) {
    console.log('Hello UserProvider Provider');
    this.statusUsers().then(
      data => this._status = data
    )
  }

  get user():User {
    return this._user;
  }

  set user(value:User) {
    this._user = value;
  }

  statusUsers(){
    return this.nativeStorage.get('users')
    .then( // Tentative de récuparation de la data stocker via la key 'users'
      data => { // Tentative success - Le plugin à pu se connecter au stockage local
        if(data == null){ // Tester si la data 'users' n'existe pas
          this.nativeStorage.set('users', []); // Création de la data 'users'
          return 0;
        }
        else{ // Test si la data 'users' existe
          if(Array.isArray(data)) // Test si c'est un tableau
            return (data.length > 0) ? 1 : -1;
          else{ // Test si c'est pas un tableau
            this.nativeStorage.set('users', []);
            return 0;
          }
        }
      },
      error => { // Tentative echec - On crée la data et on recommence le test
        this.nativeStorage.set('users', []);
        return 0;
      },
    );
  }

  checkedEmail(email:string){
    return this.nativeStorage.get('users').then(
      users => {
        if (users !== null)
          for(let i = 0; i < users.length; i++){  // Boucle sur les element stocker dans la key 'users'
            if (users[i].email === email) // Test si l'email est bon
              return true;
        } 
        return false;
      }
    )
  }

  registerUser( user:User ){
    switch(this._status){
      case 1: // Si les données recuperer ne sont pas vide
      return this.nativeStorage.get('users').then(
          users =>  {
            let isValided: boolean = false; // Init variable - L'objectif est de tester si l'email est deja dans l'array. Par defaut on dit qu'il n'y est pas
            for (let i = 0; i < users.length; i++)
              if(users[i].email === user.email) // Test si l'email est là
                isValided = true; // On enregistre dans la variable le fait qu'on ai trouvé l'email de l'utilisateur dans le tableau d'utilisateur
            if(isValided)
              return false;
            users.push(user)  // Ajouter le nouveau utiliateur dans le tableau d'utilisateur
            return true;
          }
        );
      case 0:
      case -1:
        return this.nativeStorage.set('users', [user]).then(
          data => {return true;}
        );
      default:
      return this.nativeStorage.set('users', [user]).then(
        data => {return true;}
      );
    }
  }

 /* loginUser(email:string, password:string){
    return this.checkedEmail(email).then( // Test si l'address email est enregister
      data => {
        if(data){ // Verification du resulta de la Promise 'checkedEmail'
           return this.nativeStorage.get('users').then( // Récuperation des utilisateur
            data => {
              console.log("-----------------")
              for(let i = 0; i < data.length; i++)
                if(data[i].email === email && data[i].password === password) // Verification du password
                  return data[i]
              return false;
            })
        }
        return false;
      }
    )
  }*/

  loginUser(email:string, password:string){
    return this.checkedEmail(email).then( // Test si l'address email est enregister
      data => {
        if(data){ // Verification du resulta de la Promise 'checkedEmail'
           return this.nativeStorage.get('users').then( // Récuperation des utilisateur
            users => {
              console.log("-----------------")
              for(let i = 0; i < users.length; i++)
                if(users[i].email === email && users[i].password === password){ // Verification du password
                  this._user = users[i]; // Ajout du profile user dans la class UserProvider grace au setter. Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
                  return true;
                }
              return false;
            })
        }
        return false
      }
    )
  }

  updateUser(user:User){
         return this.nativeStorage.get('users').then( // Récuperation des utilisateur
          users => {
            for(let i = 0; i < users.length; i++)
              if(users[i].email === user.email){ // Verification du password
                this._user = users[i]; // Ajout du profile user dans la class UserProvider grace au setter. Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
                this.nativeStorage.set('users', user)
                return true;
              }
            /*  if(users[i].email === isEmail.email){ // Verification du password
                this._user = users[i]; // Ajout du profile user dans la class UserProvider grace au setter. Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
                this.nativeStorage.set('users', user)
                return true;
              }*/
            return false;
      })
      return false
    }
}

