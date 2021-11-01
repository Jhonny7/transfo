import { OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { TabsPage } from '../../pages/tabs/tabs.page';
import { GenericService } from '../../services/generic.service';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OpcionesComponent } from '../opciones/opciones.component';
import { EventService } from 'src/app/services/event.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'btn-sham',
  templateUrl: './btn-sham.html',
  styleUrls: ['./btn-sham.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class BtnShamComponent implements OnDestroy, OnInit{

  @Input() btnInfo:any;
  @Output() clickButton:EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private themeService: ThemeService
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
