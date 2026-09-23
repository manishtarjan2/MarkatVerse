import { CommercialService } from './commercial.service.js';
export declare class CommercialController {
    private readonly commercialService;
    constructor(commercialService: CommercialService);
    getAdvertisements(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        linkUrl: string | null;
        position: string;
        mediaUrl: string | null;
    }[]>;
    getAdvertisement(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        linkUrl: string | null;
        position: string;
        mediaUrl: string | null;
    }>;
    createAdvertisement(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        linkUrl: string | null;
        position: string;
        mediaUrl: string | null;
    }>;
    updateAdvertisement(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        linkUrl: string | null;
        position: string;
        mediaUrl: string | null;
    }>;
    deleteAdvertisement(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        linkUrl: string | null;
        position: string;
        mediaUrl: string | null;
    }>;
    getCoupons(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        discount: number;
        type: string;
        code: string;
        validUntil: Date | null;
    }[]>;
    getCoupon(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        discount: number;
        type: string;
        code: string;
        validUntil: Date | null;
    }>;
    createCoupon(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        discount: number;
        type: string;
        code: string;
        validUntil: Date | null;
    }>;
    updateCoupon(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        discount: number;
        type: string;
        code: string;
        validUntil: Date | null;
    }>;
    deleteCoupon(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        discount: number;
        type: string;
        code: string;
        validUntil: Date | null;
    }>;
    getSubscriptions(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        features: string[];
        price: number;
        planName: string;
    }[]>;
    getSubscription(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        features: string[];
        price: number;
        planName: string;
    }>;
    createSubscription(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        features: string[];
        price: number;
        planName: string;
    }>;
    updateSubscription(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        features: string[];
        price: number;
        planName: string;
    }>;
    deleteSubscription(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        features: string[];
        price: number;
        planName: string;
    }>;
    getCommissions(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        rate: number;
        conditions: string | null;
    }[]>;
    getCommission(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        rate: number;
        conditions: string | null;
    }>;
    createCommission(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        rate: number;
        conditions: string | null;
    }>;
    updateCommission(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        rate: number;
        conditions: string | null;
    }>;
    deleteCommission(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        rate: number;
        conditions: string | null;
    }>;
}
