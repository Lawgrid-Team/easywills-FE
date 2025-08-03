export interface AuthUser {
    token: string;
    refreshToken: string;
    type: string;
    roles: [
        {
            authority: string;
        }
    ];
    firstTimeLoggedIn: boolean;
}

export interface IChangePassword {
    newPassword: string;
    confirmNewPassword: string;
    oldPassword: string;
    valid: true;
}
export interface IResetPassword {
    newPassword: string;
    confirmNewPassword: string;
    valid: true;
    token: string;
}
