import { TabsPage } from './pages/home/tabs.page';
import { Tab3Page } from './pages/home/tab3/tab3.page';
import { Tab2Page } from './pages/home/tab2/tab2.page';
import { Tab1Page } from './pages/home/tab1/tab1.page';
import { TriviaAdmonPage } from './pages/administrador/trivia-admon/trivia-admon.page';
import { AdministratorComponent } from './pages/administrador/administrator/administrator.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: "login",
    pathMatch: "full"
  },{
    path: 'home',
    redirectTo: "home/tab1",
    pathMatch: "full"
  },{
    path: 'home',
    component: TabsPage,
    children:[
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
      }
    ]
  },{
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },{
    path: 'register',
    children:[{
      path:":invitado",
      loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule),
    }]
  },
  {
    path: "root",
    children:[
      {
        path: 'administrador',
        component: TriviaAdmonPage
        //loadChildren: () => import('./pages/administrador/trivia-admon/trivia-admon.module').then( m => m.TriviaAdmonPageModule)
      },{
        path: 'admon',
        component: AdministratorComponent
      },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
