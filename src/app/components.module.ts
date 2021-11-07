import { ScrollingCardsComponent } from './components/scrolling-cards/scrolling-cards';
import { OpcionesComponent } from './components/opciones/opciones.component';
import { HeaderComponent } from './components/header/header';
import { SpinnerOverlayComponent } from './components/spinner-overlay/spinner-overlay.component';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TabsComponent } from './components/tabs/tabs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContainerComponent } from './components/container/container';
import { ContainerAppComponent } from './components/container-app/container-app';
import { NewComponent } from './components/new/new';
import { AdministratorComponent } from './pages/administrator/administrator.component';
import { CardCategoriaComponent } from './components/card-categoria/card-categoria';
import { BtnShamComponent } from './components/btn-sham/btn-sham';
import { TarjetaComentarioComponent } from './components/tarjeta-comentario/tarjeta-comentario';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        SpinnerOverlayComponent,
        SpinnerComponent,
        TabsComponent,
        HeaderComponent,
        ContainerComponent,
        ContainerAppComponent,
        OpcionesComponent,
        NewComponent,
        ScrollingCardsComponent,
        AdministratorComponent,
        CardCategoriaComponent,
        BtnShamComponent,
        TarjetaComentarioComponent
    ],
    exports:[
        SpinnerOverlayComponent,
        SpinnerComponent,
        TabsComponent,
        HeaderComponent,
        ContainerComponent,
        ContainerAppComponent,
        OpcionesComponent,
        NewComponent,
        ScrollingCardsComponent,
        AdministratorComponent,
        CardCategoriaComponent,
        BtnShamComponent,
        TarjetaComentarioComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild(
            {
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            }
        ),
    ]
})
export class ComponentsModule { }
