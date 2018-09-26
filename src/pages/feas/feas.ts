import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Imagen } from '../../clases/imagen';
import { usuario } from '../../clases/usuario';
import { Observable } from 'rxjs';
import { forEach } from '@firebase/util';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
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
  usuario:string;
  image: string; // base64
  rutaArchivo:string;
  cosas:Imagen[];
  donde:string;
  cargo:Boolean = false;

  coleccionCosas:AngularFirestoreCollection<Imagen>;
  ListadoDeCosasObservable:Observable<Imagen[]>;

  constructor(public storage: AngularFireStorage,
              private camera: Camera,
              private db: AngularFirestore,
              private loadingCtrl: LoadingController,
              private params:NavParams,
              private navCtrl: NavController)
  {
    this.usuario = this.params.get('usuario');
    this.donde = this.params.get('donde');
    this.coleccionCosas = this.db.collection<any>(this.donde);
    this.ListadoDeCosasObservable = this.coleccionCosas.snapshotChanges().map(actions =>{
      return actions.map(a =>{
        const data = a.payload.doc.data() as Imagen;
        const id = a.payload.doc.id;
        return {id, ...data};
      })
    });
    this.ListadoDeCosasObservable.subscribe( res =>{
      let ordenados = res.sort((x,y)=>{
        if(y.fecha > x.fecha){
          return 1;
        }
        if(y.fecha < x.fecha){
          return 0;
        }
        return 1;
      });
      this.cargo = true;
      this.cosas = ordenados;
    });
    
  }



  traerCosas(){
    this.coleccionCosas = this.db.collection<Imagen>('feas');
    this.ListadoDeCosasObservable = this.coleccionCosas.valueChanges()
    this.ListadoDeCosasObservable.subscribe(cosasTraidas =>{
      let ordenados = cosasTraidas.sort((x, y)=>{
        if(x.fecha > y.fecha){
          return 1;
        }
        if(x.fecha < y.fecha ){
          return 0;
        }
        return -1;
      })
      this.cosas = ordenados;
      this.cosas.forEach(element => {
        element.fecha;
      });
      this.cargo = true;
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

    this.rutaArchivo = `${this.donde}/${this.usuario}_${ new Date().getTime() }.jpg`;

    this.image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(this.rutaArchivo).putString(this.image, 'data_url');

    return this.task;
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
          this.db.collection(this.donde).add({
            nombreUsuario: this.usuario,
            url: urlImagen,
            votos: 0,
            votantes: [],
            fecha: new Date().getTime(),
          })
          .then(res =>{
            loading.dismiss();
          })
        })
      })
  }

  public votar(id:string){
    let yaVoto = false;
    this.cosas.forEach(element => {
      if(this.estaEnArray(this.usuario, element.votantes)){
        yaVoto = true;
      }
    });
    if(!yaVoto){
      let imagenVotada:Imagen[];
      imagenVotada = this.cosas.filter(imagenes => imagenes.id = id);
      imagenVotada[0].votos = imagenVotada[0].votos + 1;
      imagenVotada[0].votantes.push(this.usuario);
      this.db.collection<Imagen>(this.donde).doc(id).update(imagenVotada[0])
      .then(res =>{
        console.log("Votado!");
      })
      .catch(res =>{
        console.log("error");
        imagenVotada[0].votos = imagenVotada[0].votos -1;
      })
    }
    else if(yaVoto){
      console.log('usted ya ha votado!');
    }
  }

  private estaEnArray(value:any, array:any[]){
    return array.indexOf(value) > -1;
  }

}