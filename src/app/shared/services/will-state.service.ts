import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WillStateService {
    private isWillCompletedSubject = new BehaviorSubject<boolean>(false);
    public isWillCompleted$ = this.isWillCompletedSubject.asObservable();

    private currentPlanSubject = new BehaviorSubject<string>('Free');
    public currentPlan$ = this.currentPlanSubject.asObservable();

    constructor() {
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
}
