import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ComponentsModule } from 'src/app/components.module';
import { SwiperModule } from 'ngx-swiper-wrapper';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "../../../assets/i18n/", ".json");
}
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    TranslateModule.forChild(
    {
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }
    ),
    ComponentsModule,
    SwiperModule,
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
