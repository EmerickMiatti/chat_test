import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {HttpProvider} from "../../providers/http/http";
import {User} from "../../models/user";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

/**
 * @author: KMR
 * @email: yajuve.25.dz@gmail.com
 */

export class LoginPage {
  //Cette variable nous permets de pre-remplilre les formulaires de login ou register.
  public account = {
    username: 'yajuve',
    fullname: 'Mohamed Raouf',
    avatar: 'Raouf.png',
    email: 'emerick.miatti@gmail.com',
    password: 'test'
  };

  public loginErrorString: string; // Message d'erreur lors de la connection
  private opt: string = 'signup'; // Definir le "tabs" par default. Soit inscription, soit connection

  constructor(public http:HttpProvider,
    public userProvider: UserProvider,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public translateService: TranslateService) {
      this.menuCtrl.enable(false); // Pas d'affichage de menu
      // translateService permet d'effectuer du multi-langue
      // subscribe -> concept des PROMISE - OBSERVABLE, le traitement se fait de manière asynchrone
  }

  // Attempt to login in through our User service
  doLogin_v1() {
    this.http.get('my-profile.json').subscribe((profile:User) => { // Requete asynchrone sur le fichier my-profile.json qui se situe dans asset mocks et le contenu du fichier est mis dans la variable profile
      this.userProvider.user = <User>profile; // Ajout du profile user dans la class UserProvider grace au setter. Grace à ça, nous pouvons recuperer le profile à tout moment vu qu'il est stocker dans la classe UserProvider
      if (this.checkedUser(profile))
        this.navCtrl.setRoot('ListFriendsPage'); // setRoot -> permet de supprimer toutes les vues de la stack et de naviguer vers la root page. navCtrl -> Permet de naviger sur plusieurs page
      else{
        this.account.email = "emerick.miatti@gmail.com"
        this.account.password = "test"
        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
          this.loginErrorString = value;
          // Affichage du message d'erreur dans la page html via la variable "loginErrorString"
        })
      }
    }, (err) => {
      console.error(err); // En cas d'erreur sur la recup de l'utilisateur
    });
  }

  doLogin(){
    this.userProvider.loginUser(this.account.email, this.account.password).then(
      isConnect => {
        if(isConnect)
          this.navCtrl.setRoot('ListFriendsPage'); // setRoot -> permet de supprimer toutes les vues de la stack et de naviguer vers la root page.
        else
          this.loginErrorString = "Connecting error"
      }
    )
  }

  doRegister(){
    this.userProvider.registerUser(this.account).then(
      isConnect => {
        if(isConnect)
          this.navCtrl.setRoot('ListFriendsPage'); // setRoot -> permet de supprimer toutes les vues de la stack et de naviguer vers la root page.
        else
          this.loginErrorString = "Connecting error";
      }
    )
  }



  checkedUser(users:User){
    /*if(users.email === this.account.email && users.password === this.account.password)
      return true;
    else
      return false;*/

      return (users.email === this.account.email &&
        users.password === this.account.password) ? true : false
  }
}