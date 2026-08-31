"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <Link href="/"><button className="btn-primary" style={{ marginTop: '20px' }}>Return Home</button></Link>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setStep(3); // Success step
    }, 2000);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', padding: '0 50px' }}>
        <div style={{ color: step >= 1 ? '#F59E0B' : '#64748B', fontWeight: 'bold' }}>1. Shipping Address</div>
        <div style={{ color: step >= 2 ? '#F59E0B' : '#64748B', fontWeight: 'bold' }}>2. Payment Method</div>
        <div style={{ color: step >= 3 ? '#10B981' : '#64748B', fontWeight: 'bold' }}>3. Order Complete</div>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 2, padding: '30px', backgroundColor: '#1E293B', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <input type="text" placeholder="First Name" defaultValue="Amit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
              <input type="text" placeholder="Last Name" defaultValue="Verma" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
            </div>
            <input type="text" placeholder="Street Address" defaultValue="123 Tech Park, Phase 2" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <input type="text" placeholder="City" defaultValue="Bengaluru" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
              <input type="text" placeholder="Postal Code" defaultValue="560001" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
            </div>
            <button className="btn-primary" onClick={() => setStep(2)}>Continue to Payment</button>
          </div>
          <div style={{ flex: 1 }}>
             {/* Mini cart summary */}
             <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }}>
               <h3 style={{ marginBottom: '15px' }}>Order Summary</h3>
               {items.map(item => (
                 <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                   <span style={{ color: '#94A3B8' }}>{item.quantity}x {item.name.substring(0,20)}...</span>
                   <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                 </div>
               ))}
               <div style={{ borderTop: '1px solid #334155', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                 <span>Total:</span>
                 <span style={{ color: '#F59E0B' }}>₹{total.toLocaleString('en-IN')}</span>
               </div>
             </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 2, padding: '30px', backgroundColor: '#1E293B', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '20px' }}>Payment Method</h2>
            
            <div style={{ padding: '20px', border: '1px solid #F59E0B', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Credit / Debit Card</span>
                <span>💳</span>
              </div>
              <div style={{ marginTop: '15px' }}>
                <input type="text" placeholder="Card Number" defaultValue="4111 1111 1111 1111" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', marginBottom: '10px' }} />
                <div style={{ display: 'flex', gap: '20px' }}>
                  <input type="text" placeholder="MM/YY" defaultValue="12/28" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                  <input type="text" placeholder="CVV" defaultValue="123" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                </div>
              </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid #334155', borderRadius: '8px', marginBottom: '30px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>UPI / Netbanking</span>
                <span>📱</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
             {/* Mini cart summary */}
             <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }}>
               <h3 style={{ marginBottom: '15px' }}>Order Summary</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                 <span style={{ color: '#94A3B8' }}>Subtotal</span>
                 <span>₹{total.toLocaleString('en-IN')}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                 <span style={{ color: '#94A3B8' }}>Shipping</span>
                 <span style={{ color: '#10B981' }}>Free</span>
               </div>
               <div style={{ borderTop: '1px solid #334155', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                 <span>Total:</span>
                 <span style={{ color: '#F59E0B' }}>₹{total.toLocaleString('en-IN')}</span>
               </div>
             </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1E293B', borderRadius: '12px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{ color: '#10B981', marginBottom: '10px' }}>Payment Successful!</h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: '30px' }}>Your order #MkV-883921 has been placed successfully.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link href="/"><button className="btn-primary">Continue Shopping</button></Link>
            <Link href="/seller/dashboard"><button className="btn-outline">View My Orders</button></Link>
          </div>
        </div>
      )}

    </div>
  );
}
