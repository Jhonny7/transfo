import { OnDestroy, OnInit } from '@angular/core';
import { TabsPage } from '../../pages/tabs/tabs.page';
import { GenericService } from '../../services/generic.service';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OpcionesComponent } from '../opciones/opciones.component';
import { EventService } from 'src/app/services/event.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'container',
  templateUrl: './container.html',
  styleUrls: ['./container.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class ContainerComponent implements OnDestroy, OnInit{

  constructor(
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
