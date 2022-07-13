import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NbAuthService} from "@nebular/auth";
import {HttpClient} from "@angular/common/http";
import {DOSSIER_STATUS, pattern_amount, pattern_username} from "../../../app.constants";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
  width: string;
  right: boolean;
}


@Component({
  selector: 'ngx-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit {

  tableTitle = "Liste des dosssiers de crédit";
  modalAddVisible = false;
  modalEditVisible = false;
  validateFormAdd!: FormGroup;
  validateFormEdit!: FormGroup;
  validateFormSuspend!: FormGroup;
  validateFormEditAnalyse!: FormGroup;
  loading = true;
  credit_show = undefined;
  currentName = "";
  credit_suspend = null;
  modalSuspend = false;
  allCredits = [];
  provenance = "INTERNE";
  dossier_enum = DOSSIER_STATUS;
  modalShowDetails = false;
  modalUpdateAnalysis = false;
  action = "";
  supports = [];
  listOfColumns = [];

  constructor(private authService: NbAuthService, private http: HttpClient, private fb: FormBuilder,
              private userService: UserService, private router: Router) {
  }


  showModalAdd(): void {
    this.modalAddVisible = true;
  }

  handleCancelAdd(type = "add"): void {
    if (type === "add")
      this.modalAddVisible = false;
    else if (type === "edit")
      this.modalEditVisible = false;
    else if (type === "details")
      this.modalShowDetails = false;
    else if (type === "analysis")
      this.modalUpdateAnalysis = false;
    else if (type === "suspend") {
      this.modalSuspend = false;
    }
  }

  ngOnInit(): void {
    // Initialize add form
    this.validateFormAdd = this.fb.group({
      origin: [null, [Validators.required]],
      name: [null, [Validators.required, this.confirmationValidator('name')]],
      deliverables: [null, [Validators.required]],
      provenance: [this.provenance, [Validators.required]],
      neededAmount: [null, [Validators.pattern(pattern_amount), Validators.required]],
      recipients: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      first_cote: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      expected_end_date: [null, [Validators.required]],
      ack_date: [null, [Validators.required, this.confirmationValidator('ack_date')]],
      needed_reason: [null, [Validators.required]],
      supports: [null, [this.confirmationValidator('supports')]],
      usernameManager: [null, [Validators.required, this.confirmationValidator('manager')]],
      analyst: [null, [Validators.required, this.confirmationValidator('analyst')]],
    });

    console.log("fomr init add", this.validateFormAdd);

    // Suspend form
    this.validateFormSuspend =  this.fb.group({
      commentSuspend: [null, [Validators.required]],
    });

    this.userService.getUserDossier(true, true).subscribe(
      data => {
        if (Array.isArray(data)) {
          this.allCredits = data;
          this.listOfColumns = this.userService.setColumnData(data);
        }
        this.loading = false;
      },
    );
  }

  confirmationValidator = (formLabel: String, add = true) => {
    return (control: FormControl): { [s: string]: boolean } => {
      const errorReturn = {confirm: true, error: true};
      if (!add) {
        if (this.validateFormEdit === undefined) {
          return {};
        }
      }
      if (!control.value) {
        return {};
      } else {
        if (formLabel === "name") {
          const allNames = this.userService.allNames.filter(elt => elt !== this.currentName);
          if (allNames.includes(control.value)) return errorReturn;
        } else if (formLabel === "manager") {
          if (add) {
            if (control.value === this.validateFormAdd.controls.analyst.value ) return errorReturn;
          } else {
            if (control.value === this.validateFormEdit.controls.analystEdit.value ) return errorReturn;
          }
        } else if (formLabel === "analyst") {
          const valAnalyst = control.value;
          const valSupports = add ? this.validateFormAdd.controls.supports.value :
            this.validateFormEdit.controls.supportsEdit.value;
          const valManager = add ? this.validateFormAdd.controls.usernameManager.value :
            this.validateFormEdit.controls.usernameManagerEdit.value;
          if (valSupports) {
            if (valSupports.includes(valAnalyst)) return errorReturn;
          } else if (valManager) {
            if (valManager.includes(valAnalyst)) return errorReturn;
          }
        } else if (formLabel === "supports") {
          const analyst = add ? this.validateFormAdd.controls.analyst.value :
            this.validateFormEdit.controls.analystEdit.value;
          if (control.value.includes(analyst))
            return errorReturn;
        } else if (formLabel === "start_date" || formLabel === "expected_end_date" || formLabel === "ack_date") {

          let array_start, array_end, array_ack;
          if (add) {
            array_start = [control.value, this.validateFormAdd.controls.expected_end_date.value,
              this.validateFormAdd.controls.ack_date.value];
            array_end = [this.validateFormAdd.controls.start_date.value, control.value,
              this.validateFormAdd.controls.ack_date.value];
            array_ack = [this.validateFormAdd.controls.start_date.value,
              this.validateFormAdd.controls.expected_end_date.value, control.value];
          } else {
            array_start = [control.value, this.validateFormEdit.controls.expected_end_dateEdit.value,
              this.validateFormEdit.controls.ack_dateEdit.value];
            array_end = [this.validateFormEdit.controls.start_dateEdit.value, control.value,
              this.validateFormEdit.controls.ack_dateEdit.value];
            array_ack = [this.validateFormEdit.controls.start_dateEdit.value,
              this.validateFormEdit.controls.expected_end_dateEdit.value, control.value];
          }

          let start_date, expected_end_date, ack_date;
          if (formLabel === "start_date") [start_date, expected_end_date, ack_date] = array_start;
          else if (formLabel === "expected_end_date") [start_date, expected_end_date, ack_date] = array_end;
          else if (formLabel === "ack_date") [start_date, expected_end_date, ack_date] = array_ack;
          if (this.userService.getReadableDate(start_date) === this.userService.getReadableDate(expected_end_date))
            return errorReturn;
          else if (this.userService.getReadableDate(ack_date) === this.userService.getReadableDate(expected_end_date))
            return errorReturn;
          if (formLabel === "start_date") {
            let now_date = new Date();
            now_date = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDay());
            if (start_date < now_date) return errorReturn;
            if (expected_end_date) {
              const months = this.userService.computeNumberMonths(start_date, expected_end_date);
              if (months <= 0 || months > 365) return errorReturn;
            }
          } else if (formLabel === "expected_end_date") {
            if (start_date) {
              const months = this.userService.computeNumberMonths(start_date, expected_end_date);
              if (months <= 0 || months > 365) return errorReturn;
            }
          } else if (formLabel === "ack_date") {
            if (expected_end_date) {
              const months = this.userService.computeNumberMonths(expected_end_date, ack_date);
              if (months <= 0 || months > 365) return errorReturn;
            }
          }
        }
      }
      return {};
    };
  }

  updateValidator(formLabel: String, add = true): void {
    /** wait for refresh value */
    if (formLabel === "analyst") {
      add ? Promise.resolve().then(() => this.validateFormAdd.controls.analyst.updateValueAndValidity()) :
        Promise.resolve().then(() => this.validateFormEdit.controls.analystEdit.updateValueAndValidity());
    } else if (formLabel === "manager") {
      add ? Promise.resolve().then(() => this.validateFormAdd.controls.usernameManager.updateValueAndValidity()) :
        Promise.resolve().then(() => this.validateFormEdit.controls.usernameManagerEdit.updateValueAndValidity());
    } else if (formLabel === "supports") {
      add ? Promise.resolve().then(() => this.validateFormAdd.controls.supports.updateValueAndValidity()) :
        Promise.resolve().then(() => this.validateFormEdit.controls.supportsEdit.updateValueAndValidity());
    } else if (formLabel === "expected_end_date") {
      add ? Promise.resolve().then(() => this.validateFormAdd.controls.expected_end_date.updateValueAndValidity()) :
        Promise.resolve().then(() => this.validateFormEdit.controls.expected_end_dateEdit.updateValueAndValidity());
    } else if (formLabel === "start_date") {
      add ? Promise.resolve().then(() => this.validateFormAdd.controls.start_date.updateValueAndValidity()) :
        Promise.resolve().then(() => this.validateFormEdit.controls.start_dateEdit.updateValueAndValidity());
    } else if (formLabel === "ack_date") {
      add ? Promise.resolve().then(() => this.validateFormAdd.controls.ack_date.updateValueAndValidity()) :
        Promise.resolve().then(() => this.validateFormAdd.controls.ack_dateEdit.updateValueAndValidity());
    }
  }

  tableAction(value: any, index: any): void {
    switch (value) {
      case "details": {
        this.credit_show = this.allCredits[index];
        this.modalShowDetails = true;
        break;
      }
      case "modify": {
        const credit_edit = this.allCredits[index][0];
        this.currentName = credit_edit.name;
        const supports = credit_edit.supports.map(item => item.username);
        this.validateFormEdit = this.fb.group({
          genericCodeEdit: [credit_edit.genericCode, [Validators.required]],
          originEdit: [credit_edit.origin, [Validators.required]],
          nameEdit: [credit_edit.name, [Validators.required]],
          deliverablesEdit: [credit_edit.deliverables, [Validators.required]],
          provenanceEdit: [credit_edit.provenance, [Validators.required]],
          neededAmountEdit: [credit_edit.neededAmount, [Validators.pattern(pattern_amount), Validators.required]],
          recipientsEdit: [credit_edit.recipients, [Validators.required]],
          domainEdit: [credit_edit.domain, [Validators.required]],
          first_coteEdit: [credit_edit.first_cote, [Validators.required]],
          start_dateEdit: [new Date(credit_edit.start_date), [Validators.required]],
          expected_end_dateEdit: [new Date(credit_edit.expected_end_date), [Validators.required]],
          ack_dateEdit: [new Date(credit_edit.ack_date),
            [Validators.required, this.confirmationValidator('ack_date', false)]],
          needed_reasonEdit: [credit_edit.needed_reason, [Validators.required]],
          supportsEdit: [supports, [this.confirmationValidator('supports', false)]],
          usernameManagerEdit: [credit_edit.userManager.username,
            [Validators.required, this.confirmationValidator('manager', false)]],
          analystEdit: [credit_edit.userAnalyst.username,
            [Validators.required, this.confirmationValidator('analyst', false)]],
        });
        this.modalEditVisible = true;
        break;
      }
      case "update": {
        const analyse_update = this.allCredits[index][1];
        this.validateFormEditAnalyse = this.fb.group({
          creditGeneric: [analyse_update.creditGeneric, [Validators.required]],
          perspectives: [analyse_update.perspectives],
          amount_given: [analyse_update.amount_given, [Validators.pattern(pattern_amount)]],
          date_comity_dri: [analyse_update.date_comity_dri],
          date_transmit: [analyse_update.date_transmit],
          date_comity_great: [analyse_update.date_comity_great],
          date_establishment: [analyse_update.date_establishment],
          link: [analyse_update.link],
          comment: [null],
        });
        this.modalUpdateAnalysis =  true;
        break;
      }
      case "monitor": {
        this.router.navigate(['/pages/followWork/allEtudesHistoric', this.allCredits[index][0].genericCode,
          this.allCredits[index][0].name, "credit"]);
        break;
      }
      case "delete": {
        const genericCode = this.allCredits[index][0].genericCode;
        this.userService.deleteDossier(genericCode, true).subscribe(data => {
            if (Array.isArray(data)) {
              this.allCredits = data;
              this.listOfColumns = this.userService.setColumnData(data);
            }
          },
          err => console.log("erreur lors du chargement " + err),
        );
        break;
      }
      case "suspend": {
        this.credit_suspend = this.allCredits[index][1];
        this.action = 'init_suspension';
        this.modalSuspend = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  submitFormEditAnalysis(action = 'update'): void {
    if (this.validateFormEditAnalyse.valid) {
      console.log(this.validateFormEditAnalyse.value);
      this.userService.updateAnalysis(this.validateFormEditAnalyse.value, action, true).subscribe(data => {
        if (Array.isArray(data)) {
          this.allCredits = data;
          this.listOfColumns = this.userService.setColumnData(data);
        }
        // this.validateFormEditAnalyse.reset();
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

  submitForm(add = true): void {
    const currentForm = add ? this.validateFormAdd : this.validateFormEdit;
    if (currentForm.valid) {
      add ? this.userService.saveDossier(currentForm.value, true).subscribe(data => {
        if (Array.isArray(data)) {
          this.allCredits = data;
          this.listOfColumns = this.userService.setColumnData(data);
        }
        // currentForm.reset();
        this.modalAddVisible = false;
      }) : this.userService.updateDossier(currentForm.value, true).subscribe(data => {
        if (Array.isArray(data)) {
          this.allCredits = data;
          this.listOfColumns = this.userService.setColumnData(data);
        }
        // currentForm.reset();
        this.modalEditVisible = false;
      });
    } else {
      Object.values(currentForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  submitFormSuspend(): void {
    if (this.validateFormSuspend.valid) {
      console.log(this.validateFormSuspend.value);
      const bodyData = {
        creditGeneric: this.credit_suspend.creditGeneric,
        comment: this.validateFormSuspend.value.commentSuspend,
      };
      this.userService.updateManager(bodyData, this.action, true).subscribe( data => {
          if (Array.isArray(data)) {
            this.allCredits = data;
            this.listOfColumns = this.userService.setColumnData(data);
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
}
