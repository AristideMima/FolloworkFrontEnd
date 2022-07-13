import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'ngx-chart-panel-summary',
  styleUrls: ['./chart-panel-summary.component.scss'],
  template: `
    <div class="summary-container" *ngIf="allStats !== undefined">
      <div>
        <div>Nombre Total</div>
        <div class="h6">{{ allStats.total }}</div>
      </div>
      <div>
        <div>Demande d'inititiation</div>
        <div class="h6">{{ allStats.init_all }}</div>
      </div>
      <div>
        <div>En cours d'analyse</div>
        <div class="h6">{{ allStats.progress }}</div>
      </div>
      <div>
        <div>Dossiers Clôturés</div>
        <div class="h6">{{ allStats.close }}</div>
      </div>
<!--      <div *ngFor="let item of summary">-->
<!--        <div>{{ item.title }}</div>-->
<!--        <div class="h6">{{ item.value }}</div>-->
<!--      </div>-->
    </div>`,
})
export class ChartPanelSummaryComponent implements OnInit {
  // @Input() summary: {title: string; value: number}[];
  allStats = undefined;
  @Input() type: string ;
  @Input() username = null;
  constructor(private userService: UserService) {
  }
  ngOnInit(): void {
    if (this.username == null) {
      this.userService.getAllStat( this.type === 'credit').subscribe( data => {
        if (Object.keys(data).length !== 0)
          this.allStats = data;
      });
    } else {
      this.userService.getAllStatUser(this.type === 'credit', this.username).subscribe( data => {
        if (Object.keys(data).length !== 0) {
          this.allStats = data;
        }
      });
    }
  }
}

