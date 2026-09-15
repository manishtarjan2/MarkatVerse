import { WalletService } from './wallet.service.js';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(businessId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        totalEarnings: number;
        pendingBalance: number;
        availableBalance: number;
        withdrawn: number;
    }>;
    getTransactions(walletId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: string;
        walletId: string;
        referenceId: string | null;
        referenceType: string | null;
        paymentRef: string | null;
        grossAmount: number;
        platformFee: number;
        commission: number;
        tax: number;
        netAmount: number;
        settledAt: Date | null;
    }[]>;
    getBankAccounts(businessId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        accountName: string;
        accountNumber: string;
        ifscCode: string | null;
        bankName: string;
        isPrimary: boolean;
        isVerified: boolean;
    }[]>;
    addBankAccount(businessId: string, data: {
        accountName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        accountName: string;
        accountNumber: string;
        ifscCode: string | null;
        bankName: string;
        isPrimary: boolean;
        isVerified: boolean;
    }>;
    requestWithdrawal(businessId: string, body: {
        amount: number;
        bankAccountId: string;
    }): Promise<any>;
}
