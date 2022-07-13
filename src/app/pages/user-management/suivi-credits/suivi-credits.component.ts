import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NbAuthService} from "@nebular/auth";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-suivi-credits',
  templateUrl: './suivi-credits.component.html',
  styleUrls: ['./suivi-credits.component.scss'],
})
export class SuiviCreditsComponent implements OnInit {

  tableTitle = "Liste des dossiers de crédit suivis";
  validateFormAddComment!: FormGroup;
  allCredits = [];
  credit_show = undefined;
  loading = true;
  modalShowDetails = false;
  name = "";
  genericCode = "";
  action = "";
  modalComment = false;
  modalAddVisible = false;
  modalEditVisible = false;
  modalUpdateAnalysis = false;
  modalSuspend = false;
  listOfColumns = [];

  constructor(private authService: NbAuthService, private http: HttpClient, private fb: FormBuilder,
              private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.validateFormAddComment =  this.fb.group({
      comment: [null],
    });

    this.userService.getUserDossier(false, true).subscribe(
      data => {
        if (Array.isArray(data)) {
          this.allCredits = data;
          this.listOfColumns = this.userService.setColumnData(data);
        }
        this.loading = false;
      },
    );
  }

  submitFormComment(): void {
    if (this.validateFormAddComment.valid) {
      const bodyData = {
        creditGeneric: this.genericCode,
        comment: this.validateFormAddComment.value.comment,
      };
      this.userService.updateManager(bodyData, this.action, true).subscribe( data => {
          if (Array.isArray(data)) {
            this.allCredits = data;
            this.listOfColumns = this.userService.setColumnData(data);
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

  handleCancelAdd(type = "add"): void {
    if (type === "add")
      this.modalAddVisible = false;
    else if (type === "edit")
      this.modalEditVisible = false;
    else if (type === "details")
      this.modalShowDetails = false;
    else if (type === "analysis")
      this.modalUpdateAnalysis = false;
    else if (type === "suspend")
      this.modalSuspend = false;
    else if (type === "comment")
      this.modalComment = false;
  }

  tableAction(value: any, index: any): void {
    switch (value) {
      case "details": {
        this.credit_show = this.allCredits[index];
        this.modalShowDetails = true;
        break;
      }
      case "monitor": {
        this.router.navigate(['/pages/followWork/allEtudesHistoric',
          this.allCredits[index][0].genericCode, this.allCredits[index][0].name, "credit"]);
        break;
      }
      default: {
        break;
      }
    }
    if (this.userService.allValuesValid.includes(value)) {
      this.name = this.allCredits[index][0].name;
      this.genericCode = this.allCredits[index][0].genericCode;
      this.action = value;
      this.modalComment = true;
    }
  }

}
