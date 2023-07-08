import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { SystemErrorComponent } from 'src/app/shared/component/error/system-error.component';
import { UserListComponent } from './list/user-list.component';
import { AuthorizeGuard } from '../../shared/auth/authorize.guard';
import { AddEditComponent } from './add-edit/add-edit.component';
import { UserConfirmComponent } from './user-confirm/user-confirm.component';
import { SystemSuccessComponent } from 'src/app/shared/component/success/system-success.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { CustomRouteReuseStrategy } from 'src/app/shared/custom-route-reuse-strategy';

const routes: Routes = [
  {
    path: 'user',
    redirectTo: 'user/list',
    pathMatch: 'full',
  },
  {
    path: 'user/list',
    component: UserListComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/edit',
    component: AddEditComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/add',
    component: AddEditComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/confirm',
    component: UserConfirmComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/complete',
    component: SystemSuccessComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/detail',
    component: UserDetailComponent,
    canActivate: [AuthorizeGuard],
  },
  { path: '**', component: SystemErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class UsersRoutingModule {}
