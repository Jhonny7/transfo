import { OnDestroy, OnInit } from '@angular/core';
import { TabsPage } from './../../pages/tabs/tabs.page';
import { GenericService } from './../../services/generic.service';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OpcionesComponent } from '../opciones/opciones.component';
import { EventService } from 'src/app/services/event.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  //encapsulation: ViewEncapsulation.None
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HeaderComponent implements OnDestroy, OnInit {

  @Input() title;
  @Input() backActive: boolean;

  text: string;

  public popoverRef;
  private suscriptionPopover: Subscription;

  constructor(
    public themeService: ThemeService,
    private popoverController: PopoverController,
    private eventService: EventService,
    private genericService: GenericService
  ) {
    console.log('Hello HeaderComponent Component');
    this.text = 'Hello World';
  }

  public ngOnInit(): void {
    this.suscriptionPopover = this.eventService.get("closePopover").subscribe((data) => {
      
      this.popoverRef.dismiss();
    });
  }

  public ngOnDestroy(): void {
    if (this.suscriptionPopover) {
      this.suscriptionPopover.unsubscribe();
    }
  }

  async verOpciones(ev: any) {


    this.popoverRef = await this.popoverController.create({
      component: OpcionesComponent,
      cssClass: 'popover-class',
      event: ev,
      //translucent: true
    });
    await this.popoverRef.present();

    const { role } = await this.popoverRef.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  back() {
    window.history.back();
  }
}
