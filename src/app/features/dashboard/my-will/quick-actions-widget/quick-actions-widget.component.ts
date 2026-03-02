import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { WillStateService } from '../../../../shared/services/will-state.service';

interface QuickAction {
    text: string;
    icon: string;
    link: string;
    showWhen: (status: string) => boolean;
}

@Component({
    selector: 'app-quick-actions-widget',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './quick-actions-widget.component.html',
    styleUrls: ['./quick-actions-widget.component.scss'],
})
export class QuickActionsWidgetComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    willStatus: string = 'notStarted';

    private allActions: QuickAction[] = [
        {
            text: 'Create new Will',
            icon: '/svg/icon-create-will.svg',
            link: '/wiz/welcome',
            showWhen: (status) => status === 'notStarted',
        },
        {
            text: 'Add/Edit Assets',
            icon: '/svg/icon-edit-assets.svg',
            link: '/wiz/will/asset-inventory',
            showWhen: (status) =>
                status === 'inProgress' || status === 'scheduled',
        },
        {
            text: 'Manage Beneficiaries',
            icon: '/svg/icon-manage-beneficiaries.svg',
            link: '/wiz/will/personal-details',
            showWhen: (status) =>
                status === 'inProgress' || status === 'scheduled',
        },
        {
            text: 'Preview A4 Will',
            icon: '/svg/icon-preview-will.svg',
            link: '/view-will',
            showWhen: (status) =>
                status === 'inProgress' || status === 'scheduled',
        },
        {
            text: 'Sign and validate will',
            icon: '/svg/icon-sign-will.svg',
            link: '/wiz/will/review-and-download',
            showWhen: (status) => status === 'scheduled',
        },
    ];

    actions: QuickAction[] = [];

    constructor(private willStateService: WillStateService) {}

    ngOnInit(): void {
        // Initialize with default actions first
        this.updateVisibleActions();

        this.subscription.add(
            this.willStateService.willState$.subscribe((state) => {
                if (state) {
                    this.willStatus = state.status;
                    this.updateVisibleActions();
                }
            }),
        );

        // Load will state if not already loaded
        const currentState = this.willStateService.getWillState();
        if (currentState) {
            this.willStatus = currentState.status;
            this.updateVisibleActions();
        }
    }

    private updateVisibleActions(): void {
        this.actions = this.allActions.filter((action) =>
            action.showWhen(this.willStatus),
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
