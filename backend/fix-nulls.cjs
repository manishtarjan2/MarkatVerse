const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();
  
  await db.collection('User').updateMany({ markatId: null }, [{ $set: { markatId: { $toString: '$_id' } } }]);
  await db.collection('Business').updateMany({ businessCode: null }, [{ $set: { businessCode: { $toString: '$_id' } } }]);
  await db.collection('ServiceStaff').updateMany({ staffCode: null }, [{ $set: { staffCode: { $toString: '$_id' } } }]);
  await db.collection('Order').updateMany({ orderNumber: null }, [{ $set: { orderNumber: { $toString: '$_id' } } }]);
  await db.collection('ServiceBooking').updateMany({ bookingNumber: null }, [{ $set: { bookingNumber: { $toString: '$_id' } } }]);
  
  console.log('Updated existing records');
  await client.close();
}

run().catch(console.error);
