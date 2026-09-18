export declare class OrderItemDto {
    productId: string;
    productName?: string;
    sellerId?: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    buyerId: string;
    total: number;
    items: OrderItemDto[];
    status?: string;
}
