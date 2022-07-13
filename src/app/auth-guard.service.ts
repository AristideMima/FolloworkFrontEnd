import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import {UserService} from "./services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: NbAuthService, private router: Router, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['auth']);
          } else {
            if (route.data.roles) {
              const intersection = route.data.roles.filter( e => this.userService.roles.includes(e)).length;
              if (intersection  === 0) this.router.navigate(['pages/dashboard']);
            }
          }
        }),
      );
  }
}
