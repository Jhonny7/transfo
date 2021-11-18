import { RegisterPage } from './pages/register/register.page';
import { LoginComponent } from './pages/login/login.component';
import { SabiasPage } from './pages/home/sabias/sabias.page';
import { TriviaPage } from './pages/home/trivia/trivia.page';
import { TabsPage } from './pages/home/tabs.page';
import { Tab3Page } from './pages/home/tab3/tab3.page';
import { Tab2Page } from './pages/home/tab2/tab2.page';
import { Tab1Page } from './pages/home/tab1/tab1.page';
import { TriviaAdmonPage } from './pages/administrador/trivia-admon/trivia-admon.page';
import { AdministratorComponent } from './pages/administrador/administrator/administrator.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DirectorioComponent } from './pages/home/directorio/directorio.component';
import { AuthGuard } from './guards/auth.guard';
import { RootGuard } from './guards/root.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: "login",
    pathMatch: "full"
  }, {
    path: 'home',
    redirectTo: "home/tab1",
    pathMatch: "full"
  }, {
    path: 'home',
    component: TabsPage,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "tab1",
        component: Tab1Page
      },
      {
        path: "tab2",
        component: Tab2Page
      },
      {
        path: "tab3",
        component: Tab3Page
      },
    ]
  }, {
    path: "trivia",
    component: TriviaPage,
    canActivate: [AuthGuard],
  }, {
    path: "sabias",
    component: SabiasPage
  },
  {
    path: "directorio",
    component: DirectorioComponent
  },
  {
    component: SabiasPage,
    canActivate: [AuthGuard],
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'register',
    children: [{
      path: ":invitado",
      component: RegisterPage,
    }]
  },
  {
    path: "root",
    canActivateChild: [RootGuard],
    children: [
      {
        path: 'administrador',
        component: TriviaAdmonPage
        //loadChildren: () => import('./pages/administrador/trivia-admon/trivia-admon.module').then( m => m.TriviaAdmonPageModule)
      }, {
        path: 'admon',
        component: AdministratorComponent
      },
    ]
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
