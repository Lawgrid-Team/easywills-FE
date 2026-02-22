declare function QoreIdRegenerateSDK(): void;

declare namespace QoreIDWebSdk {
    function start(): void;
}

interface QoreIDEvent {
    status?: string;
    data?: any;
    error?: any;
}

interface Window {
    QoreIdRegenerateSDK: typeof QoreIdRegenerateSDK;
    QoreIDWebSdk: typeof QoreIDWebSdk;
    onQoreIDSdkSubmitted?: (event: QoreIDEvent) => void;
    onQoreIDSdkError?: (event: QoreIDEvent) => void;
    onQoreIDSdkClosed?: (event: QoreIDEvent) => void;
}
