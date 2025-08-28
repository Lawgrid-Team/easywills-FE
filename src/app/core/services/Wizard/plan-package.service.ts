import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../utils/api.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, type Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BeneficiaryShare, AssetType, Asset, BeneficiaryAssignment } from '../../models/interfaces/asset.interface';

const routes = {
    upgradePlan: 'api/v1/plans/upgrade',
    checkoutPlanUpgrade: 'api/v1/plans/upgrade-checkout',
}

@Injectable({
    providedIn: 'root',
})
export class PlanPackageService {
         private baseURL = environment.API_URL;
      private apiService = inject(ApiService);
    constructor() {}

    upgradePackage(plan: string): Observable<any>    {
            return this.apiService
            .post<any>(this.baseURL + routes.upgradePlan + `?plan=${plan}`)

    }

    checkoutUpgrade(paymentReference: any): Observable<any> {
        return this.apiService
            .post<any>(this.baseURL + routes.checkoutPlanUpgrade, paymentReference)
           
        }

}
