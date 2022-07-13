import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DOSSIER_STATUS, ETUDES_TYPE, pattern_amount, ROLE_ANALYST, ROLE_MANAGER, UNITS} from "../../../app.constants";
import {NbAuthService} from "@nebular/auth";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-suivi-etudes',
  templateUrl: './suivi-etudes.component.html',
  styleUrls: ['./suivi-etudes.component.scss'],
})
export class SuiviEtudesComponent implements OnInit {

  tableTitle = "Etudes suivies";
  modalAddVisible = false;
  modalEditVisible = false;
  validateFormAdd!: FormGroup;
  validateFormAddComment!: FormGroup;
  validateFormShow!: FormGroup;
  validateFormEditEtude!: FormGroup;
  validateFormEditAnalyse!: FormGroup;
  etude_show = [];
  allEtudes = [];
  action = "";
  dossier_enum = DOSSIER_STATUS;
  loading = true;
  listOfColumns = [];
  listOfOptionUnit: Array<{ label: string; value: string }> = [];
  listOfOptionAnalyst: Array<{ label: string; value: string }> = [];
  listOfOptionManager: Array<{ label: string; value: string }> = [];
  listOfOptionType: Array<{ label: string; value: string }> = [];
  handleCancelEditComment(): void {
    this.modalComment = false;
  }
  valid_init = ['INIT_DEMAND', 'INIT_REJECT'];
  invalid_init = ['INIT_VALID', 'IN_PROGRESS'];
  valid_close = ['CLOSE_DEMAND', 'CLOSE_REJECT'];
  invalid_close = ['CLOSE_SUCCESS', 'CLOSE_FAILED'];
  genericCode = "";
  name = "";
  handleCancelEditAnalysis(): void {
    this.modalUpdateAnalysis =  false;
  }
  modalComment = false;
  allValuesValid = ['valid_init', 'cancel_init', 'close_success', 'close_failed', 'cancel_close', 'cancel_suspend', 'valid_suspend'];
  dict_values = {
    'valid_init': 'VALIDATION INITIATION',
    'cancel_init': 'REJET INITIATION',
    'close_success': 'CLOTURER AVEC SUCCESS',
    'close_failed': 'CLOTURER AVEC ECHEC',
    'cancel_close': 'REJET DE CLOTURE',
    'cancel_suspend': 'REJET DE SUSPENSION',
    'valid_suspend': 'VALIDATION DE SUSPENSION',
  };

  getStatusAction(value: string, action: string): boolean {
      if (action === 'valid_init') {
        if (this.valid_init.includes(value)) return true;
    } else if (action === 'cancel_init') {
        if (this.invalid_init.includes(value)) return true;
      } else if (action === 'close_success' || action === 'close_failed') {
        if (this.valid_close.includes(value)) return true;
      } else if (action === 'cancel_close') {
        if (this.invalid_close.includes(value)) return true;
      }  else if (action === 'suspend') {
        if (value === "INIT_SUSPENSION") return true;
      }
      return false;
    }

  submitFormComment(): void {
    if (this.validateFormAddComment.valid) {
      const bodyData = {
        etudeGeneric: this.genericCode,
        comment: this.validateFormAddComment.value.comment,
      };
      this.userService.updateManager(bodyData, this.action).subscribe( data => {
        if (Array.isArray(data)) {
            this.allEtudes = data;
            this.listOfColumns = this.userService.setColumnData(data, false);
          }
        this.modalComment = false;
      },
        err => console.log("erreur lors de la mise à jour du statut " + err),
      );
    } else {
      Object.values(this.validateFormAddComment.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  tableAction(value: any, index: any): void {
    switch (value) {
      case "details": {
        this.etude_show = this.allEtudes[index];
        this.modalShowDetails = true;
        break;
      }
      case "monitor": {
        this.router.navigate(['/pages/followWork/allEtudesHistoric',
          this.allEtudes[index][0].genericCode, this.allEtudes[index][0].name, "etude"]);
        break;
      }
      default: {
        break;
      }
    }
    if (this.allValuesValid.includes(value)) {
      this.name = this.allEtudes[index][0].name;
      this.genericCode = this.allEtudes[index][0].genericCode;
      this.action = value;
      this.modalComment = true;
    }
  }

  updateFormValidatorComment() {
    Promise.resolve().then(() => this.validateFormAddComment.controls.comment.updateValueAndValidity());
  }
  updateFormValidatorAnalysis(formLabel: string) {
    if (formLabel === "comity_dri") {
      Promise.resolve().then(() => this.validateFormEditAnalyse.controls.date_comity_dri.updateValueAndValidity());
    } else if ( formLabel === "amount_given") {
      Promise.resolve().then(() => this.validateFormEditAnalyse.controls.amount_given.updateValueAndValidity());
    }
  }

  submitFormEditAnalysis(action = 'update'): void {
    if (this.validateFormEditAnalyse.valid) {
      console.log(this.validateFormEditAnalyse.value);
      this.userService.updateAnalysis(this.validateFormEditAnalyse.value, action).subscribe(data => {
        if (Array.isArray(data)) {
          this.allEtudes = data;
          this.listOfColumns = this.userService.setColumnData(data, false);
        }
        this.validateFormEditAnalyse.reset();
        this.modalUpdateAnalysis = false;
      });
    } else {
      Object.values(this.validateFormEditAnalyse.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  formatDate(date: any): string {
    if (date === null) return "/";
    const splitDate = date.split('T');
    const dateString = splitDate[0];
    return dateString;
  }

  handleCancelShow(): void {
    this.modalShowDetails = false;
  }
  /*
   Action table resources
  */
  modalShowDetails = false;
  modalUpdateAnalysis = false;
  showModalAdd(): void {
    this.modalAddVisible = true;
  }

  handleCancelAdd(): void {
    this.modalAddVisible = false;
  }
  constructor(private authService: NbAuthService, private http: HttpClient, private fb: FormBuilder,
              private userService: UserService, private router: Router,
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.validateFormAdd = this.fb.group({
      unit: [null, [Validators.required]],
      name: [null, [Validators.required]],
      neededAmount: [null, [Validators.pattern(pattern_amount), Validators.required]],
      recipients: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      start_date: [null, [Validators.required, this.confirmationValidator('start_date')]],
      expected_end_date: [null, [Validators.required, this.confirmationValidator('expected_end_date')]],
      origin: [null, [Validators.required]],
      first_cote: [null, [Validators.required]],
      type: [null, [Validators.required]],
      supports: [null, [this.confirmationValidator('supports')]],
      usernameManager: [null, [Validators.required, this.confirmationValidator('manager')]],
      analyst: [null, [Validators.required, this.confirmationValidator('analyst')]],
    });
    this.validateFormAddComment =  this.fb.group({
      comment: [null],
    });
    // Getting all etudes for a particular user
    this.userService.getUserDossier(false).subscribe(
      data => {
        if (Array.isArray(data)) {
          this.allEtudes = data;
          this.listOfColumns = this.userService.setColumnData(data, false);
        }
        this.loading = false;
      },
    );

    // Get all necessaries users
    this.userService.loadUserByRole(ROLE_ANALYST).subscribe( data_analyst => {
      // this.analyst =  data_analyst;
      this.listOfOptionAnalyst = this.populateList(this.listOfOptionAnalyst, data_analyst);
    });

    this.userService.loadUserByRole(ROLE_MANAGER).subscribe( data_manager => {
      // this.managers =  data_manager;
      this.listOfOptionManager = this.populateList(this.listOfOptionManager, data_manager);
    });
    this.listOfOptionUnit = this.populateListArray(this.listOfOptionUnit, UNITS);
    this.listOfOptionType = this.populateListArray(this.listOfOptionType, ETUDES_TYPE);
  }
  populateList(listOfOption: Array<any>, data: any): Array<any> {
    data.forEach( value => {
      listOfOption.push({
        label: value.firstName + " " +  value.lastName,
        value: value.username,
      });
    });
    return listOfOption;
  }

  formatDirection(unit: string): string {
    const values = unit.split("(");
    if (values.length < 2) return unit;
    const formatedUnit = values[1].replace(")", "");

    return formatedUnit;
  }

  confirmationValidator = (formLabel: String) => {
    return (control: FormControl): { [s: string]: boolean } => {
      const errorReturn = { confirm: true, error: true };
      if (!control.value) {
        return { required: true };
      } else {
        if (formLabel === "manager") {
          if (control.value === this.validateFormAdd.controls.analyst.value)  return { confirm: true, error: true };
        } else if (formLabel === "analyst") {
          const valAnalyst = control.value;
          const valSupports = this.validateFormAdd.controls.supports.value;
          const valManager = this.validateFormAdd.controls.usernameManager.value;
          if (valSupports ) {
            if (valSupports.includes(valAnalyst)) return errorReturn;
          } else if (valManager ) {
            if (valManager.includes(valAnalyst)) return errorReturn;
          }
        } else if (formLabel === "supports") {
          if (control.value.includes(this.validateFormAdd.controls.analyst.value))
            return errorReturn;
        } else if (formLabel === "start_date" || formLabel === "expected_end_date" ) {
          const array_start = [control.value, this.validateFormAdd.controls.expected_end_date.value];
          const array_end = [control.value, this.validateFormAdd.controls.start_date.value];
          let start_date, expected_end_date;
          [start_date, expected_end_date] = formLabel === "start_date" ?  array_start : array_end ;

          if (this.getReadableDate(start_date) === this.getReadableDate(expected_end_date))
            return errorReturn;
          if (formLabel === "start_date") {
            let now_date = new Date();
            now_date = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDay());
            if (start_date < now_date ) return errorReturn;
            if (expected_end_date) {
              const months = this.computeNumberMonths(start_date, expected_end_date);
              if ( months <= 0 || months > 365) return errorReturn;
            }
          } else if ( formLabel === "expected_end_date" ) {
            if (start_date) {
              const months = this.computeNumberMonths(start_date, expected_end_date);
              console.log(months);
              if ( months <= 0 || months > 365) return errorReturn;
            }
          }
        }
      }
      return {};
    };
  }

  confirmationValidatorEdit = (formLabel: String) => {
    return (control: FormControl): { [s: string]: boolean } => {
      const errorReturn = { confirm: true, error: true };
      if (this.validateFormEditEtude === undefined) return {};
      if (!control.value) {
        return { required: true };
      } else {
        if (formLabel === "manager") {
          if (control.value === this.validateFormEditEtude.controls.analystEdit.value)
            return { confirm: true, error: true };
        } else if (formLabel === "analyst") {
          const valAnalyst = control.value;
          const valSupports = this.validateFormEditEtude.controls.supportsEdit.value;
          const valManager = this.validateFormEditEtude.controls.usernameManagerEdit.value;
          if (valSupports ) {
            if (valSupports.includes(valAnalyst)) return errorReturn;
          } else if (valManager ) {
            if (valManager.includes(valAnalyst)) return errorReturn;
          }
        } else if (formLabel === "supports") {
          if (control.value.includes(this.validateFormEditEtude.controls.analystEdit.value))
            return errorReturn;
        } else if (formLabel === "start_date" || formLabel === "expected_end_date" ) {
          const array_start = [control.value, this.validateFormEditEtude.controls.expected_end_dateEdit.value];
          const array_end = [control.value, this.validateFormEditEtude.controls.start_dateEdit.value];
          let start_date, expected_end_date;
          [start_date, expected_end_date] = formLabel === "start_date" ?  array_start : array_end ;

          if (this.getReadableDate(start_date) === this.getReadableDate(expected_end_date))
            return errorReturn;
          if (formLabel === "start_date") {
            if (expected_end_date) {
              const months = this.computeNumberMonths(start_date, expected_end_date);
              if ( months >= 0 || months > 365) return errorReturn;
            }
          } else if ( formLabel === "expected_end_date" ) {
            if (start_date) {
              const months = this.computeNumberMonths(start_date, expected_end_date);
              if ( months <= 0 || months > 365) return errorReturn;
            }
          }
        }
      }
      return {};
    };
  }

  computeNumberMonths (startM: any, end: any): any {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays: any = Math.round((startM.getTime() - end.getTime()) / oneDay);
    return diffDays;
  }
  getReadableDate (date: any): any {
    if (date == null) return null;
    return date.toISOString().replace('-', '/').split('T')[0].replace('-', '/');
  }
  updateValidator(formLabel: String): void {
    /** wait for refresh value */
    if (formLabel === "analyst") {
      Promise.resolve().then(() => this.validateFormAdd.controls.analyst.updateValueAndValidity());
    } else if (formLabel === "manager") {
      Promise.resolve().then(() => this.validateFormAdd.controls.usernameManager.updateValueAndValidity());
    } else if (formLabel === "supports") {
      Promise.resolve().then(() => this.validateFormAdd.controls.supports.updateValueAndValidity());
    } else if (formLabel === "expected_end_date") {
      Promise.resolve().then(() => this.validateFormAdd.controls.expected_end_date.updateValueAndValidity());
    } else if (formLabel === "start_date") {
      Promise.resolve().then(() => this.validateFormAdd.controls.start_date.updateValueAndValidity());
    }
  }

  updateValidatorEditEtude(formLabel: String): void {
    /** wait for refresh value */
    if (formLabel === "analyst") {
      Promise.resolve().then(() => this.validateFormEditEtude.controls.analystEdit.updateValueAndValidity());
    } else if (formLabel === "manager") {
      Promise.resolve().then(() => this.validateFormEditEtude.controls.usernameManagerEdit.updateValueAndValidity());
    } else if (formLabel === "supports") {
      Promise.resolve().then(() => this.validateFormEditEtude.controls.supportsEdit.updateValueAndValidity());
    } else if (formLabel === "expected_end_date") {
      Promise.resolve().then(() => this.validateFormEditEtude.controls.expected_end_dateEdit.updateValueAndValidity());
    } else if (formLabel === "start_date") {
      Promise.resolve().then(() => this.validateFormEditEtude.controls.start_dateEdit.updateValueAndValidity());
    }
  }

  populateListArray(listOfOption: Array<any>, data: any): Array<any> {
    data.forEach(value => {
      listOfOption.push({
        label: value,
        value: value,
      });
    });

    return listOfOption;
  }
  submitForm(): void {
    if (this.validateFormAdd.valid) {
      // console.log(this.validateFormAdd.va)
      this.userService.saveDossier(this.validateFormAdd.value).subscribe(data => {
        if (Array.isArray(data)) {
          this.allEtudes = data;
          this.listOfColumns = this.userService.setColumnData(data, false);
        }
        this.validateFormAdd.reset();
        this.modalAddVisible = false;
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

}
