export class OrderItemDto {
  productId: string;
  productName?: string;
  sellerId?: string;
  quantity: number;
  price: number;
}

export class CreateOrderDto {
  buyerId: string;
  total: number;
  
  items: OrderItemDto[];

  status?: string;
}
