import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/authenricate/login/login.component';
import { UserListComponent } from './features/user/list/user-list.component';
import { AddEditComponent } from './features/user/add-edit/add-edit.component';
import { UserConfirmComponent } from './features/user/user-confirm/user-confirm.component';
import { UserDetailComponent } from './features/user/user-detail/user-detail.component';
import { CustomRouteReuseStrategy } from './shared/custom-route-reuse-strategy';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  {
    path: 'user/list',
    component: UserListComponent,
  },
  { path: 'user/edit', component: AddEditComponent },
  { path: 'user/confirm', component: UserConfirmComponent },
  {
    path: 'user/detail',
    component: UserDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
