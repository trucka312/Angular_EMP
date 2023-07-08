import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';
import { AppConstants } from 'src/app/app-constants';
import { CustomRouteReuseStrategy } from 'src/app/shared/custom-route-reuse-strategy';
import { Employee } from 'src/app/shared/models/employee.dto';
import { EmployeeService } from 'src/app/shared/services/employee.service';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.css'],
})
export class UserConfirmComponent implements OnInit {
  employee: Employee = {};
  message?: string;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    @Inject(RouteReuseStrategy) private reuseStrategy: CustomRouteReuseStrategy
  ) {}

  // Hàm khởi tạo component, được gọi khi component được tạo
  ngOnInit(): void {
    this.employee = history.state.employeeForm;
    console.log(this.employee);
  }

  // Back lại về trang và lưu state
  onPreviousPage(): void {
    if (this.employee.employeeId) {
      this.reuseStrategy.clearRoute('user/edit');
      this.router.navigate(['user/edit'], {
        state: {
          employeeForm: this.employee,
        },
      });
    } else {
      this.reuseStrategy.clearRoute('user/add');
      this.router.navigate(['user/add'], {
        state: {
          employeeForm: this.employee,
        },
      });
    }
  }

  // Lưu data nhân viên
  saveEmployee() {
    if (this.employee.employeeId) {
      this.message = AppConstants.UPDATE_MESSAGE;
      this.employeeService
        .updateEmployee(this.employee)
        .subscribe((res: any) => {
          if (res.code === '200') {
            console.log(res);
            this.router.navigate(['/user/complete'], {
              state: {
                message: this.message,
              },
            });
          } else {
            this.router.navigate(['/user/error'], {
              state: {
                errMessage: res.messages?.[0].params,
              },
            });
          }
          console.log(res.code);
        });
    } else {
      this.message = AppConstants.ADD_MESSAGE;
      this.employeeService.saveEmployee(this.employee).subscribe((res: any) => {
        if (res.code === '200') {
          console.log(res);
          this.router.navigate(['/user/complete'], {
            state: {
              message: this.message,
            },
          });
        } else {
          this.router.navigate(['/user/error'], {
            state: {
              errMessage: res.messages?.[0].params,
            },
          });
        }
      });
    }
  }
}
