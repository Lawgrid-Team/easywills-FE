import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../utils/api.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, type Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BeneficiaryShare, AssetType, Asset, BeneficiaryAssignment } from '../../models/interfaces/asset.interface';

const routes = {
    validateProfile: 'api/v1/users/validate-profile',
}

@Injectable({
    providedIn: 'root',
})
export class AccountService {
         private baseURL = environment.API_URL;
      private apiService = inject(ApiService);

      constructor() {}

    private accountSubject = new BehaviorSubject<any>({});

    accountData$: Observable<any> = this.accountSubject.asObservable();

    updateAccountData(data: Partial<any>): void {
            const currentData = this.accountSubject.value;
            this.accountSubject.next({
                ...currentData,
                estateDistribution: {
                    ...currentData.estateDistribution,
                    ...data,
                },
            });
        }

    validateProfile(): Observable<any>    {
            return this.apiService
            .get<any>(this.baseURL + routes.validateProfile)
            .pipe(
                tap((response) => {
                    this.updateAccountData({
                        plan: response.plan,
                        identityStatus: response.identityStatus
                    })
                })
            )

    }

}
