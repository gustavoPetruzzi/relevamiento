import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,  } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { usuario } from '../../clases/usuario';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { cosas } from '../../clases/cosas';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the FeasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feas',
  templateUrl: 'feas.html',
})
export class FeasPage {
  task: AngularFireUploadTask;

  progress: any;  // Observable 0 to 100
  usuario:usuario;
  image: string; // base64
  rutaArchivo:string;
  cosas:cosas[];
  cargo:Boolean = false;

  coleccionCosas:AngularFirestoreCollection<cosas>;
  ListadoDeCosasObservable:Observable<cosas[]>;

  constructor(public storage: AngularFireStorage,
              private camera: Camera,
              private db: AngularFirestore,
              private loadingCtrl: LoadingController,
              private params:NavParams,
              private navCtrl: NavController)
  {
    this.usuario = this.params.get('usuario');
    this.traerCosas();
  }



  traerCosas(){
    this.coleccionCosas = this.db.collection<cosas>('feas');
    this.ListadoDeCosasObservable = this.coleccionCosas.valueChanges()
    this.ListadoDeCosasObservable.subscribe(cosasTraidas =>{
      this.cosas = cosasTraidas;
      console.log(this.cosas);
    })
  }

  yaCargo(){
    this.cargo = true;
  }

  // Our methods will go here...
  async captureImage() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.CAMERA
      }

      return await this.camera.getPicture(options)
  }
  createUploadTask(file: string) {

    this.rutaArchivo = `feas/${this.usuario.nombre}_${ new Date().getTime() }.jpg`;

    this.image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(this.rutaArchivo).putString(this.image, 'data_url');

    return this.task
  } 

  async uploadHandler() {
     const base64 = await this.captureImage();
     
     let loading = this.loadingCtrl.create({
      content: 'Cargando foto...'
     });

     loading.present();
     this.createUploadTask(base64)
      .then(res =>{
        this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
        .then(urlImagen =>{
          this.db.collection('feas').add({
            nombreUsuario: this.usuario.nombre,
            url: urlImagen
          })
          .then(res =>{
            loading.dismiss();
          })
        })
      })
  }

  volver(){
    this.navCtrl.pop();
  }
  slideChanged(){
    this.cargo = false;
  }
   

}