import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {UserService} from "../../../services/user.service";
import {DOSSIER_STATUS} from "../../../app.constants";


@Component({
  selector: 'ngx-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit {
  code = "";
  name = "";
  datas = [];
  status_dossier = DOSSIER_STATUS;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      const code = params['code'];
      this.name = params['name'];
      const credit = params['type'] === "credit";
      this.userService.getMonitor(code, credit).subscribe( data => {
        this.datas = data;
      });
    });
  }

  formatDate(date: any): string {
    if (date === null || date === undefined) return "/";
    const splitDate = date.split('T');
    const dateString = splitDate[0];
    return dateString;
  }

}
