import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { idEmpresa } from '../../../../environments/environment.prod';
import { SqlGenericService } from '../../../services/sqlGenericService';
import { HttpErrorResponse } from '@angular/common/http';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Component, Input, OnInit } from '@angular/core';
/* import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual, Zoom, Autoplay, Thumbs, Controller
} from 'swiper/core';
 */

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @Input() data: any;

  public secciones: any = [{
    path: "sabias",
    icon: "assets/imgs/home/sabias.png",
    id: 0
  }, {
    path: "trivia",
    icon: "assets/imgs/home/trivia.png",
    id: 1
  }, {
    path: "/home/tab2",
    icon: "assets/imgs/home/capsula.png",
    isTab: true,
    id: 2
  }, {
    path: "",
    icon: "assets/imgs/home/directorio.png",
    id: 3
  }, {
    path: "",
    icon: "assets/imgs/home/faqs.png",
    id: 4
  },];  

  public config: SwiperConfigInterface = {
    loop: true,
    initialSlide: 0, //this one accept a number according to docs
    slidesPerView: 1, //number or 'auto'
    slidesPerColumn: 1, //number

    slidesPerGroup: 1,
    spaceBetween: 15,
    preloadImages: false,
    navigation: {
      nextEl: '.btn-right',
      prevEl: '.btn-left',
    },
    autoplay: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 50
      },
      350: {
        slidesPerView: 1.1,
        spaceBetween: 50
      },
      450: {
        slidesPerView: 1.2,
        spaceBetween: 50
      },
      550: {
        slidesPerView: 1.5,
        spaceBetween: 50
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      740: {
        slidesPerView: 2.2,
        spaceBetween: 40
      },
      840: {
        slidesPerView: 2.5,
        spaceBetween: 40
      },
      980: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      1020: {
        slidesPerView: 3.2,
        spaceBetween: 40
      },
      1200: {
        slidesPerView: 3.4,
        spaceBetween: 40
      },
    }
  };

  public ase: Array<any> = [
    { text: "hola" },
    { text: "hola2" },
    { text: "hola3" }
  ];

  public categorias: any[] = [];

  public btns: any = [{
    text: "home.contratar"
  }, {
    text: "home.buscar"
  }];

  public suscription: Subscription;
  constructor(
    private sqlGenericService: SqlGenericService,
    private themeService: ThemeService,
    private router: Router,
    private eventService: EventService
  ) {
    //console.log("------------------------tab 1---------------------");

  }

  ngOnInit() {
    //console.log(this.data);
    if (this.data.reload) {
      this.cargarCategorias();
    }



  }

  cargarCategorias() {
    let sql: string = `SELECT * FROM catalogo WHERE id_empresa = ${idEmpresa} and id_tipo_catalogo = 26 ORDER BY RAND()`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      //console.log(response);
      this.categorias = response.parameters;
    }, (error: HttpErrorResponse) => {

    });
  }

  onSwiper(swiper) {
    //console.log(swiper);
  }

  onSlideChange() {
    //console.log('slide change');
  }

  goPage(itm) {
    if (itm.isTab) {
      this.eventService.send("tabChange", itm.id);
    } else {
      console.log("no tab");
      
      this.router.navigate(["/", itm.path]);
    }
  }
}
