import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouteReuseStrategy, Router } from '@angular/router';
import { Employee } from 'src/app/shared/models/employee.dto';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { AppConstants } from 'src/app/app-constants';
import { CustomRouteReuseStrategy } from 'src/app/shared/custom-route-reuse-strategy';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  employee: Employee = {};
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    @Inject(RouteReuseStrategy) private reuseStrategy: CustomRouteReuseStrategy
  ) {}

  // Hàm xử lý khi component Detail bị hủy
  ngOnDestroy(): void {
    console.log('Detail destroyed');
  }

  // Hàm khởi tạo component, được gọi khi component được tạo
  ngOnInit(): void {
    const { employeeId, employeeForm } = history.state;
    if (employeeId) {
      this.employeeService
        .findEmployee(employeeId)
        .subscribe(async (resp: any) => {
          if (resp.code == '200') {
            resp.data.employeeLoginPassword = null;
            console.log(resp);
            this.employee = await resp.data;
          } else {
            this.router.navigate(['/user/error'], {
              state: {
                errMessage: AppConstants.FIND_ERROR_MESSAGE,
              },
            });
          }
        });
    } else {
      // this.employee = employeeForm;
      const employeeId2 = JSON.parse(localStorage.getItem('employeeId')!);
      this.employeeService
        .findEmployee(employeeId2)
        .subscribe(async (resp: any) => {
          resp.data.employeeLoginPassword = null;
          console.log(resp);
          this.employee = await resp.data;
        });
      localStorage.clear();
    }
    console.log('Detail initialized');
  }

  // Hàm xử lý khi muốn xóa nhân viên
  onEditChanges() {
    this.reuseStrategy.clearRoute('user/edit');
    this.router.navigate(['/user/edit'], {
      state: {
        employeeForm: this.employee,
      },
    });
  }

  // Hàm xử lý khi muốn xóa nhân viên
  onDeleteEmployee() {
    if (confirm(AppConstants.CONFIRM_MESSAGE) == true) {
      this.employeeService
        .deleteEmployee(this.employee.employeeId)
        .subscribe((res: any) => {
          if (res.code == '200') {
            this.router.navigate(['/user/complete'], {
              state: {
                message: AppConstants.DELETE_MESSAGE,
              },
            });
          } else {
            this.router.navigate(['/user/error'], {
              state: {
                errMessage: AppConstants.DELETE_ERROR_MESSAGE,
              },
            });
          }
        });
    } else {
      return;
    }
  }

  // Hàm xử lý sự kiện khi phím được nhấn
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      localStorage.setItem(
        'employeeId',
        JSON.stringify(this.employee.employeeId)
      );
    }
  }
}
