import { Directive, Input, OnInit } from '@angular/core';

/**
 * Generated class for the ImgPreloadDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[img-preload]', // Attribute selector
  host: {
    '[attr.src]': 'imagenFinal'
  }
})
export class ImgPreloadDirective  implements OnInit{
  @Input('img-preload')  targetSource : string;

  imagenDescargando: any;
  imageFinal: any;

  @Input() imagenDefecto: string = 'assets/imgs/preloader.gif';
  constructor() {
    console.log('Hello ImgPreloadDirective Directive');
  }
  ngOnInit() {
    this.imageFinal = this.imagenDefecto;
    this.imagenDescargando = new Image();
    this.imagenDescargando.onload = () => {
      console.log("image download...");
      this.imageFinal = this.targetSource;
      this.imagenDescargando.src = this.targetSource;
    }
  }

}
