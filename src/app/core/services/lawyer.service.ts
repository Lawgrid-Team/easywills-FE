import {Appointment, AppointmentData} from './../models/interfaces/lawyer.interface';
import {inject, Injectable} from '@angular/core';
import {ApiService} from '../utils/api.service';
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject, type Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const routes = {
    myFirmInfo: 'api/v1/partners/me',
    myFirmAppointments: 'api/v1/partners/appointments',
    previewWill: 'api/v1/wills/partner/preview',
    markAppointmentCompleted: 'api/v1/partners/appointments/mark-completed',
    uploadSignedWill: 'api/v1/wills/partner/upload-signed-will'
}

@Injectable({
    providedIn: 'root',
})
export class LawyerService {
    private baseURL = environment.API_URL;
    private apiService = inject(ApiService);
    private upcomingAppointments!: Appointment[];
    private completedAppointments!: Appointment[];
    private appointmentSubject = new BehaviorSubject<AppointmentData>({
        upcoming: this.upcomingAppointments,
        completed: this.completedAppointments
    });
    appointmentData$: Observable<AppointmentData> = this.appointmentSubject.asObservable();

    constructor() {
    }

    getMyFirmInfo(): Observable<any> {
        return this.apiService
            .post<any>(this.baseURL + routes.myFirmInfo)

    }

    getMyFirmUpcomingAppointments(): Observable<Appointment[]> {
        return this.getMyFirmAppointments("PENDING")
            .pipe(
                tap((data: Appointment[] = []) => {
                    const currentData = this.appointmentSubject.value;
                    this.appointmentSubject.next({
                        ...currentData,
                        upcoming: data ?? [],
                    });
                }),
                map(() => this.appointmentSubject.value.upcoming ?? [])
            );
    }

    getMyFirmCompletedAppointments(): Observable<Appointment[]> {
        return this.getMyFirmAppointments("COMPLETED")
            .pipe(tap((data: Appointment[]) => {
                    const currentData = this.appointmentSubject.value;
                    this.appointmentSubject.next({
                        ...currentData,
                        completed: data ?? [],
                    });

                }),
                map(() => {
                    return this.appointmentSubject.value.completed ?? []
                })
            );
    }


    previewWill(appointmentId: number) {
        return this.apiService.getPreview<any>(
            this.baseURL + routes.previewWill, {appointmentId}
        );
    }


    getMyFirmAppointments(status: "PENDING" | "COMPLETED" | "CANCELLED"): Observable<Appointment[]> {
        return this.apiService
            .get<any>(this.baseURL + routes.myFirmAppointments, {status})
            .pipe(
                map((data: any[]) => {
                    return data.map((app: any) => {
                        const appointment: Appointment = {
                            ...app
                        }
                        appointment.status = app.status == "PENDING" ? "upcoming"
                            : app.status == "COMPLETED" ? 'completed' : 'cancelled';
                        appointment.witnesses = [];

                        (app.attendees ?? []).forEach((element: any) => {
                            if (element.type == "WITNESS")
                                appointment.witnesses?.push(element.name)
                            else if (element.type == "TESTATOR")
                                appointment.clientName = element.name
                        });
                        return appointment
                    })
                })
            )

    }


    markAppointmentCompleted(appointmentId: number): Observable<Appointment> {
        return this.apiService
            .post<any>(this.baseURL + routes.markAppointmentCompleted + "?appointmentId=" + appointmentId)
    }

    uploadWill(appointmentId: number, media: File | Blob): Observable<any> {
        const formData = new FormData();
        formData.append('appointmentId', String(appointmentId));
        // Try to preserve filename if it's a File
        if (media instanceof File) {
            formData.append('file', media, media.name);
        } else {
            formData.append('file', media);
        }

        return this.apiService.postFile<any>(this.baseURL + routes.uploadSignedWill, formData)
    }

}
