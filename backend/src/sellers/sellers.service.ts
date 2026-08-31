import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', '..', '..', 'data.json');

@Injectable()
export class SellersService {
  private readDB() {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ sellers: [] }));
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }

  private writeDB(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }

  create(seller: any) {
    const db = this.readDB();
    if (!db.sellers) db.sellers = [];
    const newSeller = { 
      ...seller, 
      id: `S-${Math.floor(1000 + Math.random() * 9000)}`, 
      status: 'Pending', 
      date: new Date().toISOString().split('T')[0] 
    };
    db.sellers.push(newSeller);
    this.writeDB(db);
    return newSeller;
  }

  findAll() {
    const db = this.readDB();
    return db.sellers || [];
  }

  updateStatus(id: string, status: string) {
    const db = this.readDB();
    if (!db.sellers) return null;
    const seller = db.sellers.find((s: any) => s.id === id);
    if (seller) {
      seller.status = status;
      this.writeDB(db);
    }
    return seller;
  }
}
