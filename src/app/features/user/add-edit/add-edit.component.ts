import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Certification } from 'src/app/shared/models/certification.model';
import { Department } from 'src/app/shared/models/department.model';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Employee } from 'src/app/shared/models/employee.dto';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { Observable, map } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent implements OnInit, AfterViewInit {
  certifications: Certification[] = [];
  departments: Department[] = [];
  employee: Employee = {
    departmentId: '',
    certificationId: '',
  };
  isCertification: boolean = false;
  value: boolean = false;
  isEmployeeLoginIdExists: boolean = false;
  isPassword: boolean = false;

  @Input() employeeForm!: FormGroup;
  submitted = false;
  constructor(
    public http: HttpClient,
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService
  ) {}

  // Hàm khởi tạo component, được gọi khi component được tạo
  ngOnInit(): void {
    document.getElementById('employeeLoginId')?.focus();
    this.loadDepartments();
    this.loadCertifications();
    this.isCertification = false;
    this.intializeForm();
  }

  // Khởi tạo FormGroup và các FormControl cho employeeForm
  intializeForm(): void {
    this.employeeForm = this.formBuilder.group({
      employeeId: new FormControl(null),
      employeeLoginId: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$'),
          Validators.maxLength(50),
        ],
        asyncValidators: this.validateExistsLoginId(
          'employeeLoginId',
          'employeeId'
        ),
      }),
      employeeName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(125),
      ]),
      departmentId: new FormControl('', [Validators.required]),
      employeeNameKana: new FormControl(null, [
        Validators.required,
        Validators.maxLength(125),
        Validators.pattern('^[゠-ヿs]+$'),
      ]),
      employeeBirthDate: new FormControl(null, [Validators.required]),
      employeeEmail: new FormControl(null, [
        Validators.required,
        Validators.maxLength(125),
      ]),
      employeeTelephone: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(50),
      ]),
      certificationId: new FormControl(''),
      employeeLoginPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        this.validateMismatchPassword(
          'employeeLoginPassword',
          'employeeRePassword'
        ),
      ]),
      employeeRePassword: new FormControl(null, [
        Validators.required,
        this.validateMismatchPassword(
          'employeeLoginPassword',
          'employeeRePassword'
        ),
      ]),
      departmentName: new FormControl(null),
      certificationName: new FormControl(''),
      startDate: new FormControl(null, [
        this.validateDate('startDate', 'endDate'),
      ]),
      endDate: new FormControl(null, [
        this.validateDate('startDate', 'endDate'),
      ]),
      score: new FormControl(null),
    });
    this.employeeForm.get('startDate')?.disable();
    this.employeeForm.get('endDate')?.disable();
    this.employeeForm.get('score')?.disable();
  }

  ngAfterViewInit(): void {
    const { employeeForm } = history.state;

    // Kiểm tra xem có tồn tại thông tin employeeForm trong state của trang trước đó hay không
    if (history.state.employeeForm) {
      // Sử dụng phương thức patchValue để cập nhật giá trị của employeeForm từ state
      this.employeeForm.patchValue({
        ...employeeForm,
      });
      if (employeeForm.certificationId != null) {
        this.employeeForm.get('startDate')?.enable();
        this.employeeForm.get('endDate')?.enable();
        this.employeeForm.get('score')?.enable();
        this.employeeForm.get('score')?.addValidators(Validators.required);
        this.employeeForm.get('score')?.updateValueAndValidity();
      } else {
        this.employeeForm.get('certificationId')?.setValue('');
        this.employeeForm.get('certificationId')?.updateValueAndValidity();
      }
      if (employeeForm.employeeId != null) {
        this.employeeForm.get('employeeLoginPassword')?.clearValidators();
        this.employeeForm.get('employeeRePassword')?.clearValidators();
        this.employeeForm
          .get('employeeLoginPassword')
          ?.updateValueAndValidity();
        this.employeeForm.get('employeeRePassword')?.updateValueAndValidity();
      }
      this.employeeForm.get('startDate')?.setErrors(null);
      this.employeeForm.get('endDate')?.setErrors(null);
      this.employeeForm.get('score')?.setErrors(null);
      this.cdr.detectChanges();
    }
  }

  // Hàm load danh sách chứng chỉ
  private loadCertifications(): void {
    this.certificationService.getAllCertification().subscribe((resp) => {
      this.certifications = resp.data;
    });
  }

  // Hàm load danh sách phòng ban
  private loadDepartments(): void {
    this.departmentService.getAllDepartment().subscribe((resp) => {
      this.departments = resp.data;
    });
  }

  // Hàm để xử lý khi form được submit
  onSubmit(): void {
    this.submitted = true;
    if (this.employeeForm.get('employeeId')?.value == null) {
      this.isPassword = true;
    }
    if (this.employeeForm.invalid) {
      console.log(this.employeeForm);
      return;
    } else {
      // Chuyển hướng đến route '/user/detail' với giá trị của form nhân viên làm state
      this.router.navigate(['/user/confirm'], {
        state: { employeeForm: this.employeeForm.value },
      });
    }
  }

  // Hàm để xử lý khi có thay đổi lựa chọn phòng ban
  onChangeSelectDepartment(value: any) {
    console.log(value);
    // Tìm đối tượng phòng ban dựa trên giá trị đã chọn
    let department = this.departments.find(
      (department) => department.departmentId == value
    );
    // Cập nhật giá trị của control departmentName với tên phòng ban tương ứng
    const departmentName = department?.departmentName;
    this.employeeForm.patchValue({
      departmentName: departmentName,
    });
  }

  // Hàm để xử lý khi có thay đổi lựa chọn chứng chỉ
  onChangeSelectCertification(value: any) {
    this.isPassword = false;
    // Xác định giá trị của isCertification dựa trên giá trị đã chọn
    this.isCertification = value != 0 ? true : false;
    // Kiểm tra giá trị của isCertification để bật/tắt các control tương ứng
    if (this.isCertification) {
      this.employeeForm.get('startDate')?.enable();
      this.employeeForm.get('endDate')?.enable();
      this.employeeForm.get('score')?.enable();
    } else {
      this.employeeForm.get('startDate')?.disable();
      this.employeeForm.get('endDate')?.disable();
      this.employeeForm.get('score')?.disable();
      this.employeeForm.patchValue({
        startDate: null,
        endDate: null,
        score: null,
      });
    }
    // Tìm đối tượng chứng chỉ dựa trên giá trị đã chọn
    const certification = this.certifications.find(
      (certification) => certification.certificationId == value
    );
    // Cập nhật giá trị của control certificationName với tên chứng chỉ tương ứng
    const certificationName = certification?.certificationName;
    this.employeeForm.patchValue({
      certificationName: certificationName,
      startDate: null,
      endDate: null,
      score: null,
    });
  }

  // Hàm validator để kiểm tra tính hợp lệ của ngày bắt đầu và ngày kết thúc
  validateDate = (controlStartDate: any, controlEndDate: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDateControl = control.root?.get(controlStartDate);
      const endDateControl = control.root?.get(controlEndDate);
      const datePipe = new DatePipe('en-US');
      let startDate = startDateControl?.value;
      let endDate = endDateControl?.value;
      startDate = datePipe.transform(startDate, 'yyyy/MM/dd');
      endDate = datePipe.transform(endDate, 'yyyy/MM/dd');

      if (startDateControl && endDateControl && startDate >= endDate) {
        if (!endDateControl?.hasError('validateDate')) {
          endDateControl?.setErrors({ validateDate: true });
        }
        return { validateDate: true };
      } else {
        if (startDateControl?.hasError('validateDate')) {
          startDateControl.setErrors(null);
        }
        if (endDateControl?.hasError('validateDate')) {
          endDateControl.setErrors(null);
        }
      }
      return null;
    };
  };

  //  Hàm validator để kiểm tra trung employeeLoginId
  validateExistsLoginId = (
    controlEmployeeLoginId: string,
    controlEmployeeId: string
  ): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<any> => {
      const employeeLoginId = control.root.get(controlEmployeeLoginId)?.value;
      const employeeId = control.root.get(controlEmployeeId)?.value;
      return this.employeeService
        .findExistingEmployee(employeeLoginId, employeeId)
        .pipe(
          map((exists: boolean) => {
            return exists ? { checkExists: true } : null;
          })
        );
    };
  };

  // Hàm xử lý khi điều kiện điều hướng được thỏa mãn
  onNavigateWithConditions(): void {
    if (this.employeeForm.controls['employeeId'].value) {
      console.log(this.employeeForm);
      this.router.navigate(['/user/detail'], {
        state: {
          employeeForm: this.employeeForm.value,
        },
      });
    } else {
      this.router.navigate(['/user/list']);
    }
  }

  // Hàm xử lý khi điều kiện điều hướng được thỏa mãn
  onPasswordChange() {
    if (this.employeeForm.get('employeeId')?.value) {
      this.employeeForm
        .get('employeeLoginPassword')
        ?.addValidators([Validators.minLength(8),Validators.maxLength(50)]);
      this.employeeForm.get('employeeLoginPassword')?.updateValueAndValidity();
      this.employeeForm
        .get('employeeRePassword')
        ?.addValidators([
          Validators.required,
          this.validateMismatchPassword(
            'employeeLoginPassword',
            'employeeRePassword'
          ),
        ]);
      this.employeeForm.get('employeeRePassword')?.updateValueAndValidity();
      if (this.employeeForm.get('employeeLoginPassword')?.value.length == 0) {
        this.employeeForm.get('employeeRePassword')?.clearValidators();
        this.employeeForm.get('employeeRePassword')?.setValue(null);
        this.employeeForm.get('employeeRePassword')?.updateValueAndValidity();
      }
    }
  }

  // Hàm kiểm tra employeeRePassword với giống như employeePassword
  validateMismatchPassword = (
    controlEmployeeLoginPassword: any,
    controlEmployeeRePassword: any
  ): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const employeeLoginPassword = control.root.get(
        controlEmployeeLoginPassword
      )?.value;
      const employeeRePassword = control.root.get(
        controlEmployeeRePassword
      )?.value;
      if (
        employeeLoginPassword &&
        employeeRePassword &&
        employeeLoginPassword != employeeRePassword
      ) {
        return { validateMismatch: true };
      }
      return null;
    };
  };
}
