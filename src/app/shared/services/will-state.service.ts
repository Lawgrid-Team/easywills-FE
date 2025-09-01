import {ApiService} from './../../core/utils/api.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TimeUtils} from '../utils/time-utils';

const routes = {
    willStatus: 'api/v1/wills/state',
}
@Injectable({
    providedIn: 'root',
})
export class WillStateService {
    private baseURL = environment.API_URL;
    private willStateSubject = new BehaviorSubject<any>(null);
    public willState$ = this.willStateSubject.asObservable();

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

    getWillState() {
        if (this.willStateSubject.value == null) {
            this.getWillStatusFromBE().subscribe();
        }
        return this.willStateSubject.value;
    }

    getWillStatusFromBE(): Observable<any> {
        return this.apiService
            .get<any>(this.baseURL + routes.willStatus)
            .pipe(
               tap((response) => {
                   this.setWillCompleted(response.status === 'SIGNED')
                    this.currentPlanSubject.next(response.account.plan)
                }),
                map((response) => {
                    const willState = {
                        ...response,
                        status: response.status === null ? null :
                            response.status === 'SIGNED' ? 'completed' : 'inProgress',
                        account: {
                            ...response.account,
                            planText: response.account.plan === 'FREE' ? 'Free' : response.account.plan === 'LEGACY' ? 'Legacy'
                                : response.account.plan === 'LEGACY_PLUS' ? 'Legacy+' : ''
                        },
                        lastUpdatedTimeAgo: TimeUtils.timeAgo(response.lastUpdatedDate)

                    }

                    this.willStateSubject.next(willState)

                    return willState;
                })
            )
    }
}
