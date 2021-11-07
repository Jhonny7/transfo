import { GenericService } from './../../services/generic.service';
import { Component } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { ModalCrearTarjetaPage } from "../../pages-modals/modal-crear-tarjeta/modal-crear-tarjeta";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  tiendas_list = [
    {
      logo:
        "https://www.pixelero.com.mx/wp-content/uploads/2013/04/chedraui.png",
      name: "Chedraui"
    },
    {
      logo:
        "https://www.pixelero.com.mx/wp-content/uploads/2013/04/chedraui.png",
      name: "Cinepolis"
    },
    {
      logo:
        "https://www.pixelero.com.mx/wp-content/uploads/2013/04/chedraui.png",
      name: "Chonita"
    },
    {
      logo:
        "https://www.pixelero.com.mx/wp-content/uploads/2013/04/chedraui.png",
      name: "Don Pollo"
    },
    {
      logo:
        "https://www.pixelero.com.mx/wp-content/uploads/2013/04/chedraui.png",
      name: "Aurrera"
    }
  ];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private genericService: GenericService
  ) {}

  newCard() {
    console.log("crear tarjeta");
    let modalNewCard = this.modalCtrl.create(ModalCrearTarjetaPage);
    modalNewCard.present();

    modalNewCard.onDidDismiss(data => {
      console.log(data);
    });
  }
}
