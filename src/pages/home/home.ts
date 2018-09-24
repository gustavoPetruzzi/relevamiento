import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FeasPage } from '../feas/feas';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  usuario:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.usuario = this.navParams.get('usuario');
  }

  public navegar(donde:string){
    switch (donde) {
      case 'lindas':
        this.navCtrl.push(FeasPage,{
          donde: 'lindas',
          usuario: this.usuario,
        });
        break;
      case 'feas':
        this.navCtrl.push(FeasPage,{
          donde: 'feas',
          usuario: this.usuario,
        });
      default:
        break;
    }
  }
}
