import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddEditComponent } from './add-edit/add-edit.component';
import { UserConfirmComponent } from './user-confirm/user-confirm.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
@NgModule({
  declarations: [
    UserListComponent,
    AddEditComponent,
    UserConfirmComponent,
    UserDetailComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
