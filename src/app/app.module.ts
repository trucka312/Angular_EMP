import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/authenricate/login/login.component';
import { UsersModule } from './features/user/users.module';
import { SystemErrorComponent } from './shared/component/error/system-error.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './shared/auth/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { SystemSuccessComponent } from './shared/component/success/system-success.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './shared/custom-route-reuse-strategy';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SystemErrorComponent,
    SystemSuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsersModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  providers: [
    TokenInterceptor,
    DatePipe,
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
