import { PrismaService } from '../prisma.service.js';
export declare class IdGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    private getNextId;
    private getDateString;
    generateUserId(): Promise<string>;
    generateAdminId(): Promise<string>;
    generateStaffId(): Promise<string>;
    generateBusinessId(type?: string): Promise<string>;
    generateProductId(): Promise<string>;
    generateServiceId(): Promise<string>;
    generateReviewId(): Promise<string>;
    generateRequirementId(): Promise<string>;
    generateRfqId(): Promise<string>;
    generateQuotationId(): Promise<string>;
    generateAppointmentId(): Promise<string>;
    generateBookingId(isToken?: boolean): Promise<string>;
    generateOrderId(): Promise<string>;
    generatePaymentId(): Promise<string>;
    generateInvoiceId(): Promise<string>;
    generateShipmentId(): Promise<string>;
    generateAuditLogId(): Promise<string>;
}
