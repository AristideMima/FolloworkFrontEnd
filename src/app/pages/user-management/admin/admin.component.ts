import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';
import {HttpHeaders, HttpClient} from "@angular/common/http";
import {URL_ADD_USER, URL_DELETE_USER, URL_EDIT_USER, URL_GET_USER} from "../../../app.constants";
import {catchError, tap} from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {NzSelectSizeType} from "ng-zorro-antd/select";
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'ngx-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  validateFormAdd!: FormGroup;
  validateFormEdit!: FormGroup;
  token =  '';
  users = [];
  loading = true;
  tableTitle = "Liste des utilisateurs";
  modalAddVisible = false;
  modalEditVisible = false;
  listOfOption: Array<{ label: string; value: string }> = [];
  size: NzSelectSizeType = 'default';
  singleValue = ['ROLE_ANALYST'];
  multipleValue = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER', 'ROLE_ANALYST'];
  val_undefined = undefined;
  user_edit = undefined;
  authorizationHeader = null;
  loadingRequest = false;

  constructor(
    private authService: NbAuthService, private http: HttpClient, private fb: FormBuilder,
    private msg: NzMessageService) { }

  showModalAdd(): void {
    this.modalAddVisible = true;
  }

  showModalEdit(): void {
    this.modalEditVisible = true;
  }

  handleCancelAdd(): void {
    this.modalAddVisible = false;
  }

  handleCancelEdit(): void {
    this.modalEditVisible = false;
    this.user_edit = undefined;
  }

  handleOkAdd(): void {

  }

  editUser(id: Number): void {
    const user_selected = this.users.find(currentuser => currentuser.id === id);

    if (user_selected !== undefined ) {
      const roles = user_selected.roles.map(item => item.name);

      this.validateFormEdit = this.fb.group({
        emailEdit: [user_selected.email, [Validators.email, Validators.required]],
        usernameEdit: [user_selected.username, [Validators.pattern('^[a-zA-Z]+_[a-zA-Z]+$'), Validators.required]],
        firstNameEdit: [user_selected.firstName, [Validators.required]],
        lastNameEdit: [user_selected.lastName, [Validators.required]],
        rolesEdit: [roles, [Validators.required]],
      });
      this.user_edit = user_selected;
      this.modalEditVisible = true;
    }
  }

  ngOnInit(): void {

    const children: Array<{ label: string; value: string }> = [];
    this.multipleValue.forEach( valueData => {
      children.push({
        label: valueData,
        value: valueData,
      });
    });
    this.listOfOption = children;
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.token = 'Bearer ' + token.getValue();
          this.authorizationHeader =
          this.loadusers().subscribe( datas => {
            this.users = datas;
          });
        } else {
          console.log('token: no token');
        }
      });
    this.validateFormAdd = this.initFormValue();

    this.validateFormEdit = this.fb.group({
      emailEdit: [null, [Validators.email, Validators.required]],
      usernameEdit: [null, [Validators.pattern('^[a-zA-Z]+_[a-zA-Z]+$'), Validators.required]],
      firstNameEdit: [null, [Validators.required]],
      lastNameEdit: [null , [Validators.required]],
      rolesEdit: [null, [Validators.required]],
    });
  }

  loadusers(): Observable<any> {

    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `${this.token}`),
    };
    return this.http.get<any>(URL_GET_USER, header)
      .pipe(tap(
        val => this.loading =  false),
        catchError(
          this.handleError<any>( 'Depot', this.users),
        ));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.loading =  false;
      // TODO: send the error to remote logging infrastructure
      // this.msg.error('Error geting datas');

      return of(result as T);
    };
  }

  // Form add building
  submitForm(): void {
    if (this.validateFormAdd.valid) {
      this.loadingRequest = true;
      const formData = this.validateFormAdd.value;
      delete formData['checkPassword'];
      this.modifyUser(formData, URL_ADD_USER).subscribe( datas => {
        this.users = datas;
        this.loadingRequest = false;
        this.validateFormAdd = this.initFormValue();
        this.modalAddVisible = false;
        this.msg.success('Nouvel utilisateur ajouté');
      });
    } else {

      Object.values(this.validateFormAdd.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateFormAdd.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateFormAdd.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  initFormValue(): any {
    return this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      username: [null, [Validators.pattern('^[a-zA-Z]+_[a-zA-Z]+$'), Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      roles: [null, [Validators.required]],
    });
  }
  modifyUser(datas: any, url: any): Observable<any> {
    console.log("doing.... " + url);
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `${this.token}`),
    };

    return this.http.post<any>(url, datas, header)
      .pipe(tap(
        val => {
          console.log(val);
        }),
        catchError(
          this.handleError<any>( 'user', this.users),
        ));
  }

  submitFormEdit(): void {
    // console.log(this.validateFormEdit.value);
    // console.log(this.validateFormEdit.errors);
    // console.log(this.validateFormEdit.valid);
    if (this.validateFormEdit.valid) {

      console.log("validated: " + this.validateFormEdit.value);
      this.loadingRequest = true;
      const formData = this.validateFormEdit.value;
      console.log(formData);
      this.modifyUser(formData, URL_EDIT_USER).subscribe( datas => {
        this.users = datas;
        this.loadingRequest = false;
        this.modalEditVisible = false;
        this.msg.success('Mise à jour effectuée');
      });
    } else {
      Object.values(this.validateFormEdit.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  confirmDelete(id: Number): void {

    this.deleteUser(id).subscribe(
      datas => {
        this.users = datas;
        this.msg.success('Utilisateur supprimé');
      });
  }
  deleteUser(id: Number): Observable<any> {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `${this.token}`),
    };

    return this.http.post<any>(URL_DELETE_USER, id, header)
      .pipe(tap(
        val => {
          console.log(val);
        }),
        catchError(
          this.handleError<any>( 'user', this.users),
        ));
  }
}
