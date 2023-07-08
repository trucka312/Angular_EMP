import { Component, Inject, OnInit } from '@angular/core';
import { CustomRouteReuseStrategy } from '../../custom-route-reuse-strategy';
import { RouteReuseStrategy, Router } from '@angular/router';

@Component({
  selector: 'app-system-success',
  templateUrl: './system-success.component.html',
})
export class SystemSuccessComponent implements OnInit {
  message?: string;

  constructor(
    @Inject(RouteReuseStrategy) private reuseStrategy: CustomRouteReuseStrategy,
    private router: Router
  ) {}

  // Hàm chuyển đến trang danh sách nhân viên
  ngOnInit(): void {
    const { message } = history.state;
    this.message = message;
  }

  // Hàm chuyển đến trang danh sách nhân viên
  toList(): void {
    this.reuseStrategy.clearRoute('user/list');
    this.router.navigate(['/user/list']);
  }
}
