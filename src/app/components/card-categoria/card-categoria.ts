import { environment } from './../../../environments/environment.prod';
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
  selector: 'card-categoria',
  templateUrl: './card-categoria.html',
  styleUrls: ['./card-categoria.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class CardCategoriaComponent implements OnDestroy, OnInit{

  @Input() card;

  public env:any = environment;

  constructor(
    private themeService: ThemeService
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
