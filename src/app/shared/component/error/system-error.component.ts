import { Component, Inject, OnInit } from '@angular/core';
import { RouteReuseStrategy, Router } from '@angular/router';
import { CustomRouteReuseStrategy } from '../../custom-route-reuse-strategy';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent implements OnInit {
  errorMessage: string = 'システムエラーが発生しました。';

  constructor(
    private router: Router,
    @Inject(RouteReuseStrategy) private reuseStrategy: CustomRouteReuseStrategy
  ) {}

  ngOnInit(): void {
    const { errMessage, errReponse } = history.state;
    this.errorMessage = errMessage;
    console.log(errReponse);
  }

  onRedirectWithConditions(): void {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    } else {
      this.reuseStrategy.clearRoute('user/list');
      this.router.navigate(['user/list']);
    }
  }
}
