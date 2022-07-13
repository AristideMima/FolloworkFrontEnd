import {Component, OnInit} from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {NbMenuItem} from "@nebular/theme";
import {UserService} from "../services/user.service";
import {ROLE_ADMIN, ROLE_ANALYST, ROLE_MANAGER} from "../app.constants";

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu: NbMenuItem[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.menu = [
      {
        title: 'TABLEAU DE BORD',
        group: true,
      },
      {
        title: 'Tableau de bord',
        icon: 'home-outline',
        link: 'dashboard',
        home: true,
      },
      {
        title: 'ADMINISTRATION',
        group: true,
        hidden: this.userService.hiddenMenu([ROLE_ADMIN]),
      },
      {
        title: 'Gestion utilisateurs',
        icon: 'people-outline',
        link: 'followWork/admin',
        // home: true,
        hidden: this.userService.hiddenMenu([ROLE_ADMIN]),
      },
      {
        title: 'ETUDES / PROJETS',
        group: true,
      },
      {
        title: 'Suivi - Etudes',
        icon: 'arrowhead-right',
        link: 'followWork/followEtudes',
        // home: true,
        hidden: this.userService.hiddenMenu([ROLE_MANAGER]),
      },
      {
        title: 'Mes Etudes / Projets',
        icon: 'folder-outline',
        link: 'followWork/allEtudes',
        hidden: this.userService.hiddenMenu([ROLE_ANALYST]),
      },
      {
        title: 'DOSSIERS DE CREDITS',
        group: true,
      },
      {
        title: 'Suivi - Crédits',
        icon: 'arrowhead-right',
        link: 'followWork/followCredits',
        // home: true,
        hidden: this.userService.hiddenMenu([ROLE_MANAGER]),
      },
      {
        title: 'Mes Dossiers de Crédit',
        icon: 'folder-outline',
        link: 'followWork/allCredit',
        hidden: this.userService.hiddenMenu([ROLE_ANALYST]),
      },
    ];
  }
}
