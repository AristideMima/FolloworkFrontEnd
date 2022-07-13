import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {NzSelectSizeType} from "ng-zorro-antd/select";
import {Observable, of} from "rxjs";
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';
import {HttpHeaders, HttpClient} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {
  DOSSIER_STATUS,
  ETUDES_TYPE,
  pattern_amount,
  PROVENANCE,
  ROLE_ANALYST,
  ROLE_MANAGER,
  UNITS,
} from "../../../app.constants";
import { UserService } from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-etudes',
  templateUrl: './etudes.component.html',
  styleUrls: ['./etudes.component.scss'],
})
export class EtudesComponent implements OnInit {

  tableTitle = "Mes études";
  modalAddVisible = false;
  modalEditVisible = false;
  validateFormAdd!: FormGroup;
  validateFormSuspend!: FormGroup;
  validateFormEditEtude!: FormGroup;
  validateFormEditAnalyse!: FormGroup;
  etude_show = [];
  currentName = "";
  etude_suspend = null;
  modalSuspend = false;
  allEtudes = [];
  action = "";
  provenance = "INTERNE";
  dossier_enum = DOSSIER_STATUS;
  modalShowDetails = false;
  modalUpdateAnalysis = false;
  loading = true;
  listOfColumns = [];
  listOfOptionOrigin: Array<{ label: string; value: string }> = [];
  listOfOptionAnalyst: Array<{ label: string; value: string }> = [];
  listOfOptionManager: Array<{ label: string; value: string }> = [];
  listOfOptionType: Array<{ label: string; value: string }> = [];
  listOfOptionProvenance: Array<{ label: string; value: string }> = [];

  constructor(private authService: NbAuthService, private http: HttpClient, private fb: FormBuilder,
              private userService: UserService, private router: Router,
  ) {}

  submitFormSuspend(): void {
    if (this.validateFormSuspend.valid) {
      const bodyData = {
        etudeGeneric: this.etude_suspend.genericCode,
        comment: this.validateFormSuspend.value.commentSuspend,
      };
      this.userService.updateManager(bodyData, this.action).subscribe( data => {
          if (Array.isArray(data)) {
            this.allEtudes = data;
            this.listOfColumns = this.userService.setColumnData(data, false);
          }
          this.modalSuspend = false;
        },
        err => console.log("erreur lors de la mise à jour du statut " + err),
      );
    } else {
      Object.values(this.validateFormSuspend.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancelEdit(): void {
    this.modalEditVisible = false;
  }

  handleCancelSuspend(): void {
    this.modalSuspend = false;
  }

  handleCancelEditAnalysis(): void {
    this.modalUpdateAnalysis =  false;
  }

  submitFormEdit(): void {
    if (this.validateFormEditEtude.valid) {
      this.userService.updateDossier(this.validateFormEditEtude.value).subscribe(data => {
        if (Array.isArray(data)) {
          this.allEtudes = data;
          this.listOfColumns = this.userService.setColumnData(data, false);
        }
        this.modalEditVisible = false;
      });
    } else {
      Object.values(this.validateFormEditEtude.controls).forEach(control => {
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
      case "modify": {
        const etude_edit = this.allEtudes[index][0];
        const supports = etude_edit.supports.map(item => item.username);
        this.currentName = this.allEtudes[index][0].name;
        this.validateFormEditEtude = this.fb.group({
          genericCodeEdit: [etude_edit.genericCode, [Validators.required]],
          nameEdit: [etude_edit.name, [Validators.required, this.confirmationValidatorEdit('name')]],
          recipientsEdit: [etude_edit.recipients, [Validators.required]],
          provenanceEdit: [etude_edit.provenance, [Validators.required]],
          deliverablesEdit: [etude_edit.deliverables, [Validators.required]],
          domainEdit: [etude_edit.domain, [Validators.required]],
          start_dateEdit: [new Date(etude_edit.start_date),
            [Validators.required, this.confirmationValidatorEdit('start_date')]],
          expected_end_dateEdit: [new Date(etude_edit.expected_end_date),
            [Validators.required, this.confirmationValidatorEdit('expected_end_date')]],
          originEdit: [etude_edit.origin, [Validators.required]],
          first_coteEdit: [etude_edit.first_cote, [Validators.required]],
            typeEdit: [etude_edit.type, [Validators.required]],
          supportsEdit: [supports, [this.confirmationValidatorEdit('supports')]],
          usernameManagerEdit: [etude_edit.userManager.username,
            [Validators.required, this.confirmationValidatorEdit('manager')]],
          analystEdit: [etude_edit.userAnalyst.username,
            [Validators.required, this.confirmationValidatorEdit('analyst')]],
        });
        this.modalEditVisible = true;
        break;
      }
      case "update": {
        const analyse_update = this.allEtudes[index][1];
        this.validateFormEditAnalyse = this.fb.group({
          etudeGeneric: [analyse_update.etudeGeneric, [Validators.required]],
          perspectives: [analyse_update.perspectives],
          amount_given: [analyse_update.amount_given, [Validators.pattern(pattern_amount)]],
          date_comity_dri: [analyse_update.date_comity_dri, [Validators.required]],
          link: [analyse_update.link],
          comment: [null],
        });
        this.modalUpdateAnalysis =  true;
        break;
      }
      case "monitor": {
        this.router.navigate(['/pages/followWork/allEtudesHistoric', this.allEtudes[index][0].genericCode,
          this.allEtudes[index][0].name, "etude"]);
        break;
      }
      case "delete": {
        const genericCode = this.allEtudes[index][0].genericCode;
        this.userService.deleteDossier(genericCode).subscribe(data => {
          if (Array.isArray(data)) {
              this.allEtudes = data;
              this.listOfColumns = this.userService.setColumnData(data, false);
            }
        },
          err => console.log("erreur lors du chargement " + err),
        );
        break;
      }
      case "suspend": {
        this.etude_suspend = this.allEtudes[index][0];
        this.action = 'init_suspension';
        this.modalSuspend = true;
        break;
      }
      default: {
        break;
      }
    }
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

  showModalAdd(): void {
    this.modalAddVisible = true;
  }

  handleCancelAdd(): void {
    this.modalAddVisible = false;
  }

  ngOnInit(): void {
    // Initialize form
    this.validateFormAdd = this.fb.group({
      origin: [null, [Validators.required]],
      name: [null, [Validators.required, this.confirmationValidator('name')]],
      deliverables: [null, [Validators.required]],
      provenance: [this.provenance, [Validators.required]],
      recipients: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      start_date: [null, [Validators.required, this.confirmationValidator('start_date')]],
      expected_end_date: [null, [Validators.required, this.confirmationValidator('expected_end_date')]],
      first_cote: [null, [Validators.required]],
      type: [null, [Validators.required]],
      supports: [null, [this.confirmationValidator('supports')]],
      usernameManager: [null, [Validators.required, this.confirmationValidator('manager')]],
      analyst: [null, [Validators.required, this.confirmationValidator('analyst')]],
    });
    // Getting all etudes for a particular user
    this.userService.getUserDossier().subscribe(
      data => {
        if (Array.isArray(data)) {
          this.allEtudes = data;
          this.listOfColumns = this.userService.setColumnData(data, false);
        }
        this.loading = false;
      },
    );
    this.validateFormSuspend =  this.fb.group({
      commentSuspend: [null, [Validators.required]],
    });
    // Get all necessaries users
    this.userService.loadUserByRole(ROLE_ANALYST).subscribe( data_analyst => {
      // this.analyst =  data_analyst;
      this.listOfOptionAnalyst = this.populateList(this.listOfOptionAnalyst, data_analyst);
    });

    this.userService.loadUserByRole(ROLE_MANAGER).subscribe( data_manager => {
      // this.managers =  data_manager;
      this.listOfOptionManager = this.populateList(this.listOfOptionManager, data_manager);
    });
    this.listOfOptionOrigin = this.populateListArray(this.listOfOptionOrigin, UNITS, true);
    this.listOfOptionType = this.populateListArray(this.listOfOptionType, ETUDES_TYPE);
    this.listOfOptionProvenance = this.populateListArray(this.listOfOptionProvenance, PROVENANCE);
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

  updateFormValidatorSuspend() {
    Promise.resolve().then(() => this.validateFormSuspend.controls.commentSuspend.updateValueAndValidity());
  }

  confirmationValidator = (formLabel: String) => {
    return (control: FormControl): { [s: string]: boolean } => {
      const errorReturn = { confirm: true, error: true };
      if (!control.value) {
        return {};
      } else {
        if (formLabel === "name") {
          const allNames = this.userService.allNames;
          if (allNames.includes(control.value)) return errorReturn;
        } else if (formLabel === "manager") {
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
          if (control.value.length === 0) return null;
          if (control.value.includes(this.validateFormAdd.controls.analyst.value)) {
            console.log("errors datas");
            return errorReturn;
          }
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
        return { };
      } else {
        if (formLabel === "name") {
          const allNames = this.userService.allNames.filter(elt => elt !== this.currentName);
          if (allNames.includes(control.value)) return errorReturn;
        } else if (formLabel === "manager") {
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
    if (formLabel === "name") {
      Promise.resolve().then(() => this.validateFormAdd.controls.name.updateValueAndValidity());
    } else if (formLabel === 'analyst') {
      Promise.resolve().then(() => this.validateFormAdd.controls.analyst.updateValueAndValidity());
    } else if (formLabel === 'manager') {
      Promise.resolve().then(() => this.validateFormAdd.controls.usernameManager.updateValueAndValidity());
    } else if (formLabel === 'supports') {
      Promise.resolve().then(() => this.validateFormAdd.controls.supports.updateValueAndValidity());
    } else if (formLabel === 'expected_end_date') {
      Promise.resolve().then(() => this.validateFormAdd.controls.expected_end_date.updateValueAndValidity());
    } else if (formLabel === 'start_date') {
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

  populateListArray(listOfOption: Array<any>, data: any, unit= false): Array<any> {
    data.forEach(value => {
      listOfOption.push({
        label: !unit ? value : (value.split("(")[1]).replace(")", ""),
        value: value,
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
          console.log(control);
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
