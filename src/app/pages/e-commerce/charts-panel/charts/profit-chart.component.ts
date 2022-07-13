import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { ProfitChart } from '../../../../@core/data/profit-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';
import {UserService} from "../../../../services/user.service";
import {ROLE_ANALYST} from "../../../../app.constants";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-profit-chart',
  styleUrls: ['./charts-common.component.scss'],
  template: `
    <div class="row" style="margin-top: 30px">
      <div class="col-4">
        <nz-input-group [nzSuffix]="inputClearTpl">
          <input (input)="onInput($event)" type="text" nz-input [(ngModel)]="nameSearch" placeholder="Rechercher un analyste par son nom ou prénom" />
        </nz-input-group>
        <ng-template #inputClearTpl>
          <i
            nz-icon
            class="ant-input-clear-icon"
            nzTheme="fill"
            nzType="close-circle"
            *ngIf="nameSearch"
            (click)="allowClear()"
          ></i>
        </ng-template>
      </div>
    </div>
    <div class="col-12" id="data-table" style="margin-top: 20px"  >
      <nz-table [nzTitle]="tableTitle " [nzLoading]="loading"  #groupingTable [nzData]="analystDataFilter" nzBordered nzSize="middle" [nzOuterBordered]="true"  [nzPageSize]="200" [nzScroll]="{ x: '800px', y: '240px' }">
        <thead>
        <tr>
          <th nzWidth="50" style="text-align:center" >Nom d'utilisateur</th>
          <th nzWidth="50" style="text-align:center" >Email</th>
          <th nzWidth="50" style="text-align:center">Nom</th>
          <th nzWidth="50" style="text-align:center" >Prénom</th>
          <th style="text-align:center" ></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let data of groupingTable.data; let i = index">
          <td style="text-align:center" >{{data.username}}</td>
          <td style="text-align:center" >{{data.email}}</td>
          <td style="text-align:center" >{{data.firstName}}</td>
          <td style="text-align:center" >{{data.lastName}}</td>
          <td style="text-align: center">
            <button (click)="userDetails(i)"  nz-button nzType="primary"  nzSize="20"> Voir plus</button>
          </td>
        </tr>
        </tbody>
      </nz-table>
    </div>
  `,
})
export class ProfitChartComponent implements  OnInit {

  // @Input() profitChartData: ProfitChart;

  tableTitle = "Liste des analystes";
  nameSearch =  null;

  private alive = true;

  echartsIntance: any;
  options: any = {};
  analystData = [];
  analystDataFilter = [];
  listOfColumn = [];
  loading = true;

  constructor(private theme: NbThemeService, private router: Router,
              private layoutService: LayoutService, private userService: UserService) {
  }

  userDetails(index: any) {
    const user = this.analystData[index];
    this.router.navigate(['/pages/followWork/userDetails', user.username,
      user.firstName, user.lastName]);
  }

  onInput(e: any) {
    if (this.analystData.length !== 0 && this.nameSearch !== null) {
      this.analystDataFilter = this.analystData.filter( row => {
        const allName = row.firstName + " " + row.lastName;
        return allName.toLowerCase().includes(this.nameSearch.toLowerCase());
      });
    }
  }

  allowClear() {
    if ( this.analystData.length !== 0) {
      this.analystDataFilter = this.analystData;
      this.nameSearch = null;
    }
  }

  ngOnInit(): void {
    this.userService.loadUserByRole(ROLE_ANALYST).subscribe( data => {
      if (Array.isArray(data)) {
        this.analystData = data;
        this.analystDataFilter = data;
      }
      this.loading = false;
    });
  }
}
