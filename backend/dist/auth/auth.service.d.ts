import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    phoneLogin(phone: string): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    getMe(token: string): Promise<{
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
    resetPassword(resetToken: string, newPassword: string): Promise<{
        message: string;
    }>;
    private generateToken;
}
