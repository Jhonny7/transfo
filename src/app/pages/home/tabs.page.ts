import { Subscription } from 'rxjs';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Tabs } from 'src/app/components/tabs/tabs';
import { AdDirective } from 'src/app/directives/ad.directive';
import { UtilService } from 'src/app/services/util.service';
import { Tab1Page } from './tab1/tab1.page';
import { TranslateService } from '@ngx-translate/core';
import { Tab2Page } from './tab2/tab2.page';
import { Tab3Page } from './tab3/tab3.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy{

  public tabs: Tabs[] = [{
    title: 'Preguntas Frecuentes',
    icon: "clipboard",
    active: false,
    component: Tab2Page,
    url: "home/tab2",
    reload: true
  },{
    title: this.translateService.instant("menu.home"),
    icon: "hammer",
    active: true,
    component: Tab1Page,
    url: "home/tab1",
    reload: true
  },{
    title: 'Capsula Informativa',
    icon: "newspaper",
    active: false,
    component: Tab3Page,
    url: "home/tab3",
    reload: true
  }];

  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;

  private suscription:Subscription;

  constructor(
    private utilService: UtilService,
    private router: Router,
    private translateService: TranslateService,
    private eventService: EventService
  ) { 
   //console.log("---->");
    
  }

  ngOnInit(){
    this.suscription = this.eventService.get("translate").subscribe((data)=>{
      this.tabs[0].title = this.translateService.instant("menu.curriculum");
      this.tabs[1].title = this.translateService.instant("menu.home");
      this.tabs[2].title = this.translateService.instant("menu.news");
    });

  }

  ngOnDestroy(){
    this.suscription.unsubscribe();
  }

  tabSelect(tab: Tabs) {
    this.tabs.forEach(element => {
      element.active = false;
    });

    tab.active = true;

    tab.data = { ...tab };
    if (tab.url) {
      this.router.navigate([tab.url]);
    }
   //console.log(this.adHost);
    
    this.utilService.renderDynamicComponent(tab.component, this.adHost, tab.data);
  }
}
