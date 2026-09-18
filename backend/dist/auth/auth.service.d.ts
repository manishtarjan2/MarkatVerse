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
    googleLogin(token: string, role?: string): Promise<{
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
        business: ({
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                totalEarnings: number;
                pendingBalance: number;
                availableBalance: number;
                withdrawn: number;
                owedToPlatform: number;
            } | null;
        } & {
            businessType: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            pincode: string | null;
            latitude: number | null;
            longitude: number | null;
            userId: string;
            logo: string | null;
            businessModel: import(".prisma/client").$Enums.MainType;
            address: string | null;
            verified: boolean;
            capabilities: string[];
            maxListings: number;
            commissionType: string;
            commissionRate: number;
            subscriptionStatus: string;
            subscriptionStartDate: Date | null;
            subscriptionEndDate: Date | null;
        }) | null;
        id: string;
        email: string | null;
        phone: string | null;
        name: string;
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
