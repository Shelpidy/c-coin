export type MailTransportOption = {
    host: string;
    port: number | any;
    auth: {
        user: string;
        pass: string;
    };
};

export type SenderDetail = {
    name?: string;
    email: string;
};
