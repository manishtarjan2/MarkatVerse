import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(data: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    login(data: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    phoneLogin(data: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    getMe(authHeader: string): Promise<{
        id: string;
        business: {
            id: string;
            businessType: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            logo: string | null;
            businessModel: import(".prisma/client").$Enums.MainType;
            address: string | null;
            verified: boolean;
            capabilities: string[];
        } | null;
        name: string;
        email: string | null;
        phone: string | null;
        role: string;
    }>;
    forgotPassword(identifier: string): Promise<{
        message: string;
        reset_token: string;
        user_name: string;
    }>;
    resetPassword(data: {
        reset_token: string;
        new_password: string;
    }): Promise<{
        message: string;
    }>;
}
