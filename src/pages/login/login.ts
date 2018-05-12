import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { HomePage } from '../home/home';

//login
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { usuario } from '../../clases/usuario';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  

  coleccionTipada: AngularFirestoreCollection<usuario>;
  listadoUsuarios: Observable<usuario[]>;
  nombre: string;
  usuario:usuario;
  pass: string;
  clave:string;
  
  constructor(
    public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private angularFire: AngularFireAuth,
    ) 
  {
    this.firestore.firestore.settings({ timestampsInSnapshots: true });
  }

 

  async login(){
    let esperador = this.esperar();
    esperador.present();
    await this.angularFire.auth.signInWithEmailAndPassword(this.nombre,this.clave)
      .then(result => 
        {
          this.coleccionTipada = this.firestore.collection<usuario>('usuarios');
          // .snapshotChanges() returns a DocumentChangeAction[], which contains
          // a lot of information about "what happened" with each change. If you want to
          // get the data and the id use the map operator.
          this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as usuario;
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          });
          let algo =this.listadoUsuarios.map( datos =>{
            datos.forEach(element => {
              if(element.nombre == this.nombre){
                this.usuario = element;
                console.log(this.usuario);
                esperador.dismiss();
              }
            });
          })
          algo.toPromise().then(listo =>{
            let logueadoBien = this.esperar(fondo);
            logueadoBien.present();
          })
          let fondo = `
          <div>
            <ion-row text-center>
              <img src="assets/imgs/logueado.png">
            </ion-row>
            <ion-row>
              <h1> Logueado correctamente! </h1>
            </ion-row> 
          </div> `;
          let logueadoBien = this.esperar(fondo);
          logueadoBien.present();

          logueadoBien.onDidDismiss(() => {
            this.navCtrl.setRoot(HomePage, { 
              usuario: this.usuario
            })    
          })
          
          
          setTimeout(function() {
            logueadoBien.dismiss();  
          }, 1000);

          
        })




      .catch(error =>
        {
          esperador.dismiss();
          console.log("NO SE HA LOGUEADO")
        });
  }




  ingresar(){
    switch (this.nombre) {
      case 'admin@gmail.com':
        this.clave= '111111';
        break;
      case 'invitado@gmail.com':
        this.clave = '222222';
        break;
      case 'usuario@gmail.com':
        this.clave = '333333';
        break;
      case 'anonimo@gmail.com':
        this.clave = '444444';
        break;
      case 'tester@gmail.com':
        this.clave = '555555';
        break;
      default:
        this.clave = this.pass;
        break;
    }
    this.login();
  }



  creaFondo(mensaje, error){
    let fondo:string;
    if(error){
      fondo = `
          <div>
            <ion-row text-center>
              <img src="assets/imgs/error.png">
            </ion-row>
            <ion-row>
              <h1> ${mensaje} </h1>
            </ion-row> 
          </div> `;
    }
    return fondo;

  }


  esperar(personalizado?:string) {
    let loading;
    if(!personalizado){
      loading = this.loadingCtrl.create({

        content: 'Por favor, espere...'
      });
    }
    else{
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    return loading;
  }

}
