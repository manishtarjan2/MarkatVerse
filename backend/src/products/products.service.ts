import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private dataFile = path.join(process.cwd(), 'data.json');

  private getProducts(): any[] {
    if (!fs.existsSync(this.dataFile)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
  }

  private saveProducts(products: any[]) {
    fs.writeFileSync(this.dataFile, JSON.stringify(products, null, 2), 'utf8');
  }

  create(data: any) {
    const products = this.getProducts();
    const newProduct = { ...data, id: data.id || Math.random().toString(36).substr(2, 9) };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  findAll() {
    return this.getProducts();
  }

  findOne(id: string) {
    return this.getProducts().find(p => p.id === id);
  }

  update(id: string, data: any) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products[index] = { ...products[index], ...data };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  }

  remove(id: string) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return { success: true };
  }
}
