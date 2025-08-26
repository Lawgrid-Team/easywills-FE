import { ApiService } from './../../core/utils/api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const routes = {
    willStatus: 'api/v1/wills/state',
}
@Injectable({
    providedIn: 'root',
})
export class WillStateService {
    private baseURL = environment.API_URL;
    private isWillCompletedSubject = new BehaviorSubject<boolean>(false);
    public isWillCompleted$ = this.isWillCompletedSubject.asObservable();

    private currentPlanSubject = new BehaviorSubject<string>('Free');
    public currentPlan$ = this.currentPlanSubject.asObservable();

    constructor(
        private apiService: ApiService
    ) {
        // Update plan when will completion status changes
        this.isWillCompleted$.subscribe((completed) => {
            this.currentPlanSubject.next(completed ? 'Legacy+' : 'Free');
        });
    }

    setWillCompleted(completed: boolean): void {
        this.isWillCompletedSubject.next(completed);
    }

    getWillCompleted(): boolean {
        return this.isWillCompletedSubject.value;
    }

    getWillStatus(): 'inProgress' | 'completed' {
        return this.isWillCompletedSubject.value ? 'completed' : 'inProgress';
    }

    getWillStatusFromBE(): Observable<any> {
        return this.apiService
            .get<any>(this.baseURL + routes.willStatus)
            .pipe(
               tap((response) => {
                    this.setWillCompleted(response.status === 'ACTIVE')
                    this.currentPlanSubject.next(response.account.plan)
                }),
                map((response) => {
                    return {
                        ...response,
                        status : response.status === 'ACTIVE' ? 'completed' : 'inProgress'
                    }
                })
            )
    }
}
