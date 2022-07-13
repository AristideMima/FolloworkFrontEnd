/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import {NbMenuService} from "@nebular/theme";
import {NbAuthService} from "@nebular/auth";
import { Router } from "@angular/router";
import { NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService,
              private menuService: NbMenuService, private authService: NbAuthService,
              private router: Router, private msg: NzMessageService) {
    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }

  onContecxtItemSelection(title) {
    if (title === "Log out") {
      // console.log('i\'m logout');
      localStorage.clear();
      this.router.navigate(["auth"]);
      this.msg.success('Décconnexion effectuée');
    }
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
