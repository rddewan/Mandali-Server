
export type MeResponse = {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    photo?: string;
    role: object;
    guild: object;
    church: object;
};