/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//     return this.authService.user.pipe(
//         map((user) => {
//             if (user) {
//                 let userRole = user.roles[0].authority;
//                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
//                 let userRoute =
//                     userRole === Roles.ADMIN
//                         ? '/admin/dashboard'
//                         : userRole === Roles.USER
//                         ? '/wiz'
//                         : '/login';
//                 // check if route is restricted by role
//                 //   if (
//                 //     route.data?.['roles'] &&
//                 //     route.data?.['roles'].indexOf(userRole) === -1
//                 //   ) {
//                 //     // role not authorised so redirect to the last page
//                 //     // this.router.navigate([userRoute]);
//                 //     // if (route.routeConfig?.path == '') {
//                 //     //   this.router.navigate([userRoute]);
//                 //     // } else {
//                 //     // }
//                 //     this.utilService.back();
//                 //     return false;
//                 //   }
//                 // authorised so return true
//                 return true;
//             }
//             // not logged in so redirect to login page with the return url
//             this.router.navigate(['/login'], { replaceUrl: true });
//             return false;
//         })
//     );
// };

import { Injectable } from '@angular/core';
import { Roles } from '../models/enums/roles';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        //console.log('Role', route.data?.['roles']);
        return this.authService.user.pipe(
            map((user) => {
                if (user) {
                    let userRole = user.roles[0].authority;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    let userRoute =
                        userRole === Roles.ADMIN
                            ? '/admin/dashboard'
                            : userRole === Roles.USER
                            ? '/wiz'
                            : '/login';
                    // check if route is restricted by role
                    //   if (
                    //     route.data?.['roles'] &&
                    //     route.data?.['roles'].indexOf(userRole) === -1
                    //   ) {
                    //     // role not authorised so redirect to the last page
                    //     // this.router.navigate([userRoute]);
                    //     // if (route.routeConfig?.path == '') {
                    //     //   this.router.navigate([userRoute]);
                    //     // } else {
                    //     // }
                    //     this.utilService.back();
                    //     return false;
                    //   }
                    // authorised so return true
                    return true;
                }
                // not logged in so redirect to login page with the return url
                this.router.navigate(['/login'], { replaceUrl: true });
                return false;
            })
        );
    }
}
