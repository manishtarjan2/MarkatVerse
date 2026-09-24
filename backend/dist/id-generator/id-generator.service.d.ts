import { PrismaService } from '../prisma.service.js';
export declare class IdGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    private getNextId;
    generateUserId(): Promise<string>;
    generateBusinessId(): Promise<string>;
    generateStaffId(): Promise<string>;
    generateOrderId(): Promise<string>;
    generateBookingId(isToken?: boolean): Promise<string>;
    generateAuditLogId(): Promise<string>;
}
