import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'ngx-details-dossiers',
  templateUrl: './details-dossiers.component.html',
  styleUrls: ['./details-dossiers.component.scss'],
})
export class DetailsDossiersComponent implements OnInit {

  username = null;
  firstName = null;
  lastName = null;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      this.username = params['username'];
      this.firstName = params['firstName'];
      this.lastName = params['lastName'];
    });
  }

}
