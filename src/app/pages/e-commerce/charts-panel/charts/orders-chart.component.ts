import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';

import { OrdersChart } from '../../../../@core/data/orders-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';
import {UserService} from "../../../../services/user.service";
import {Validators} from "@angular/forms";
import {pattern_amount} from "../../../../app.constants";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-orders-chart',
  styleUrls: ['./charts-common.component.scss'],
  template: `
    <!-- Modal to show an Etude details -->
    <div class="col-12" *ngIf="etude_show !== undefined">
      <nz-space [nzSize]="'large'">
        <nz-modal [(nzVisible)]="modalShowDetailsEtude" nzTitle="Détails" (nzOnCancel)="handleCancel()" [nzWidth]="800">
          <div *nzModalContent>
            <div class="row">
              <div class="col-12">
                <cdk-virtual-scroll-viewport class="demo-infinite-container">
                  <nz-list nzBordered nzHeader="Détail de l'étude" nzSize="small">
                    <nz-list-item><span nz-typography>Nom: </span>{{etude_show[0].name}}</nz-list-item>
                    <nz-list-item><span nz-typography>Code: </span>{{etude_show[0].genericCode}}</nz-list-item>
                    <nz-list-item><span
                      nz-typography>Analyste: </span>{{etude_show[0].userAnalyst.firstName}} {{etude_show[0].userAnalyst.lastName}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Supérieur: </span>{{etude_show[0].userManager.firstName}} {{etude_show[0].userManager.lastName}}
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Supports: </span>
                      <span>
                     <div *ngFor="let support of etude_show[0].supports">
                      {{support.firstName}} {{support.lastName}}
                    </div>
                  </span>
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Provenance & Demandeur </span>{{etude_show[0].provenance}}
                      & {{userService.formatDirection(etude_show[0].origin)}} </nz-list-item>
                    <nz-list-item><span nz-typography>Type </span>{{etude_show[0].type}} </nz-list-item>
                    <nz-list-item><span nz-typography>Livrables attendus: </span> {{etude_show[0].deliverables}}
                    </nz-list-item>
                    <nz-list-item><span nz-typography> Destinataires </span>{{etude_show[0].recipients}} </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Date de demande d'initiation le & Fin probable </span>{{userService.formatDate(etude_show[0].start_date)}}
                      & {{userService.formatDate(etude_show[0].expected_end_date)}}</nz-list-item>
                  </nz-list>
                  <nz-list nzBordered nzHeader="Détail de l'analyse" nzSize="small">
                    <nz-list-item><span nz-typography>Statut actuel: </span> {{userService.dossier_enum[etude_show[1].status]}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Budget consommé: </span> {{etude_show[1].amount_given | number: '':'fr-FR' }}
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Lien: </span> <a
                      href="{{ etude_show[1].link}}">{{ etude_show[1].link}}</a></nz-list-item>
                    <nz-list-item><span nz-typography>Perspectives: </span> {{etude_show[1].perspectives}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de validation pour initiation  : </span> {{ userService.formatDate(etude_show[1].date_validation) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de rejet  : </span> {{ userService.formatDate(etude_show[1].date_validation) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate d'initiation de cloture  : </span> {{ userService.formatDate(etude_show[1].date_init_close) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate  de passage comité DRI  : </span> {{ userService.formatDate(etude_show[1].date_comity_dri) }}
                    </nz-list-item>
                  </nz-list>
                </cdk-virtual-scroll-viewport>
              </div>
            </div>
          </div>
          <div *nzModalFooter style="text-align: center"></div>
        </nz-modal>
      </nz-space>
    </div>
    <!-- Modal to show an Credit details -->
    <div class="col-12" *ngIf="etude_show !== undefined">
      <nz-space [nzSize]="'large'">
        <nz-modal [(nzVisible)]="modalShowDetailsCredit" nzTitle="Détails du dossier"
                  (nzOnCancel)="handleCancel()" [nzWidth]="800">
          <div *nzModalContent>
            <div class="row">
              <div class="col-12">
                <cdk-virtual-scroll-viewport class="demo-infinite-container">
                  <nz-list nzBordered nzHeader="Détail du dossier" nzSize="small">
                    <nz-list-item><span nz-typography>Nom: </span>{{etude_show[0].name}}</nz-list-item>
                    <nz-list-item><span nz-typography>Code: </span>{{etude_show[0].genericCode}}</nz-list-item>
                    <nz-list-item><span
                      nz-typography>Analyste: </span>{{etude_show[0].userAnalyst.firstName}} {{etude_show[0].userAnalyst.lastName}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Supérieur: </span>{{etude_show[0].userManager.firstName}} {{etude_show[0].userManager.lastName}}
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Supports: </span>
                      <span>
                     <div *ngFor="let support of etude_show[0].supports">
                      {{support.firstName}} {{support.lastName}}
                    </div>
                  </span>
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Provenance & Demandeur </span>{{etude_show[0].provenance}}
                      & {{userService.formatDirection(etude_show[0].origin)}} </nz-list-item>
                    <nz-list-item><span nz-typography>Besoin  </span>{{etude_show[0].needed_reason}} </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Montant demandé </span>{{etude_show[0].neededAmount | number:'':'fr-FR'}}
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Livrables attendus: </span> {{etude_show[0].deliverables}}
                    </nz-list-item>
                    <nz-list-item><span nz-typography> Destinataires </span>{{etude_show[0].recipients}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Date de demande d'initiation le & Fin probable </span>{{userService.formatDate(etude_show[0].start_date)}}
                      & {{userService.formatDate(etude_show[0].expected_end_date)}}</nz-list-item>
                  </nz-list>
                  <nz-list nzBordered nzHeader="Détail de l'analyse" nzSize="small">
                    <nz-list-item><span nz-typography>Statut actuel: </span> {{userService.dossier_enum[etude_show[1].status]}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>Montant accordé: </span> {{etude_show[1].amount_given | number: '':'fr-FR' }}
                    </nz-list-item>
                    <nz-list-item><span nz-typography>Lien: </span> <a
                      href="{{ etude_show[1].link}}">{{ etude_show[1].link}}</a></nz-list-item>
                    <nz-list-item><span nz-typography>Perspectives: </span> {{etude_show[1].perspectives}}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de validation pour initiation  : </span> {{ userService.formatDate(etude_show[1].date_validation) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de rejet  : </span> {{ userService.formatDate(etude_show[1].date_validation) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate d'initiation de cloture  : </span> {{ userService.formatDate(etude_show[1].date_init_close) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de passage comité DRI  : </span> {{ userService.formatDate(etude_show[1].date_comity_dri) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de passage au grand comité  : </span> {{ userService.formatDate(etude_show[1].date_comity_great) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de transmission au DCE/Risque/Conformité   : </span> {{ userService.formatDate(etude_show[1].date_transmit) }}
                    </nz-list-item>
                    <nz-list-item><span
                      nz-typography>\tDate de Mise en place   : </span> {{ userService.formatDate(etude_show[1].date_establishment) }}
                    </nz-list-item>
                  </nz-list>
                </cdk-virtual-scroll-viewport>
              </div>
            </div>
          </div>
          <div *nzModalFooter style="text-align: center"></div>
        </nz-modal>
      </nz-space>
    </div>

    <!-- Modal for the Table -->
    <div class="col-12" id="data-table" style="margin-top: 20px">
      <nz-table [nzTitle]="tableTitleCredit " [nzAlign]="'center'" [nzLoading]="loading"  #groupingTable [nzData]="dataDoc" nzBordered nzSize="middle" [nzOuterBordered]="true"  [nzPageSize]="200" [nzScroll]="{ x: '1500px', y: '300px' }">
        <thead>
        <tr>
          <th
            style="text-align: center"
            [nzRight]="column.right"
            *ngFor="let column of listOfColumns"
            [nzSortOrder]="column.sortOrder"
            [nzSortFn]="column.sortFn"
            [nzSortDirections]="column.sortDirections"
            [nzFilterMultiple]="column.filterMultiple"
            [nzFilters]="column.listOfFilter"
            [nzFilterFn]="column.filterFn"
          >
            {{ column.name }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let data of groupingTable.data; let i = index">
          <td style="text-align:center;">{{data[0].genericCode}}</td>
          <td style="text-align:center" >{{data[0].name}}</td>
          <td style="text-align:center"  >{{data[0].userAnalyst.username}}</td>
          <td style="text-align:center"  >{{data[0].domain}}</td>
          <td *ngIf="type !== 'credit'" style="text-align:center"  >{{data[0].type}}</td>
          <td style="text-align:center" >{{data[0].origin}}</td>
          <td style="text-align:center"  >{{data[0].userManager.username}}</td>
          <td style="text-align:center"  >
            <div *ngFor="let support of data[0].supports">
              <span>{{support.username}}</span> <br />
            </div>
          </td>
          <td style="text-align:center" nzRight>
            <nz-tag [nzColor]="'blue'">
              {{userService.dossier_enum[data[1].status]}}
            </nz-tag>
          </td>
          <td style="text-align: center;" nzRight>
            <button nz-button nz-dropdown [nzDropdownMenu]="actionMenu">
              Action
              <i nz-icon nzType="down"></i>
            </button>
            <nz-dropdown-menu #actionMenu="nzDropdownMenu">
              <ul nz-menu>
                <li (click)="tableAction('details', i)" nz-menu-item>Détails </li>
                <li (click)="tableAction('monitor', i)" nz-menu-item>Historique suivi</li>
              </ul>
            </nz-dropdown-menu>
          </td>
        </tr>
        </tbody>
      </nz-table>
    </div>
  `,
})
export class OrdersChartComponent implements  OnInit {

  @Input() type: string;
  @Input() username: string;
  dataDoc = [];
  loading = true;
  listOfColumns = [];
  tableTitleCredit = "Liste des dossiers";
  modalShowDetailsEtude = false;
  modalShowDetailsCredit = false;
  etude_show = [];

  constructor(private theme: NbThemeService, private layoutService: LayoutService, private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUserDossier(true, this.type === "credit", this.username).subscribe( data => {
      if (Array.isArray(data)) {
        this.dataDoc = data;
        this.listOfColumns = this.userService.setColumnData(data, this.type === "credit");
      }

      this.loading = false;
    });
  }

  handleCancel(): void {
    this.type === "credit" ?  this.modalShowDetailsCredit = false : this.modalShowDetailsEtude = true;
  }

  tableAction(value: any, index: any): void {
    switch (value) {
      case "details": {
        this.etude_show = this.dataDoc[index];
        this.type === "credit" ? this.modalShowDetailsCredit = true : this.modalShowDetailsEtude = true;
        break;
      }
      case "monitor": {
        this.router.navigate(['/pages/followWork/allEtudesHistoric', this.dataDoc[index][0].genericCode,
          this.dataDoc[index][0].name, this.type]);
        break;
      }
      default: {
        break;
      }
    }
  }


}
