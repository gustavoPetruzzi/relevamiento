import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { usuario } from '../../clases/usuario';
import { LindasPage } from '../lindas/lindas';
import { FeasPage } from '../feas/feas';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuario:usuario;
  imagen: string;
  constructor(
    public navCtrl: NavController,
    public Params: NavParams,
    private camara: Camera
  ) 
  {

    this.usuario = this.Params.get('usuario');
    console.log(this.usuario);
  }


  cambiar(ruta:string){
    if(ruta == "LindasPage"){
      this.navCtrl.push(LindasPage,{
        usuario: this.usuario
      });
    }
    else{
      this.navCtrl.push(FeasPage,{
        usuario: this.usuario
      });
    }
  }
}
