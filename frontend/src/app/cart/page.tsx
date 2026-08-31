"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <h2>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#94A3B8', marginTop: '10px', marginBottom: '20px' }}>Discover amazing products in our global marketplace.</p>
        <Link href="/">
          <button className="btn-primary">Start Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px' }}>
      
      <div style={{ flex: 2 }}>
        <h2>Shopping Cart ({items.length} items)</h2>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', padding: '20px', backgroundColor: '#1E293B', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: '#334155', borderRadius: '8px', marginRight: '20px' }}></div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{item.name}</h3>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981' }}>₹{item.price.toLocaleString('en-IN')}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: '6px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '5px 15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '5px 15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '14px' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ padding: '24px', backgroundColor: '#1E293B', borderRadius: '12px', border: '1px solid #334155', position: 'sticky', top: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Shipping:</span>
            <span style={{ color: '#10B981' }}>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Taxes:</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #334155', fontSize: '20px', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <Link href="/checkout">
            <button className="btn-primary" style={{ width: '100%', marginTop: '30px', padding: '16px', fontSize: '16px' }}>
              Proceed to Checkout ➔
            </button>
          </Link>
          
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '24px' }}>
            <span>💳</span>
            <span>🏦</span>
            <span>📱</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748B', marginTop: '10px' }}>100% Secure Payments</div>
        </div>
      </div>
    </div>
  );
}
