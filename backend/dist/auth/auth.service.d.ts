import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
export declare class AuthService {
    private prisma;
    private jwtService;
    private idGenerator;
    constructor(prisma: PrismaService, jwtService: JwtService, idGenerator: IdGeneratorService);
    signup(data: any): Promise<{
        access_token: string;
        user: {
            id: any;
            markatId: any;
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
            markatId: any;
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
            markatId: any;
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
            markatId: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    getMe(token: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        role: string;
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
            id: string;
            name: string;
            pincode: string | null;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            businessCode: string | null;
            userId: string;
            logo: string | null;
            description: string | null;
            businessModel: import(".prisma/client").$Enums.MainType;
            businessType: string;
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
        markatId: string | null;
        email: string | null;
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
