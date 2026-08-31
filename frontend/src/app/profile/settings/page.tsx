"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');
  const { user } = useAuth();
  
  // Fallbacks if user is null (though they should be logged in to see this)
  const [firstName, lastName] = user?.name ? user.name.split(' ') : ['Amit', 'Verma'];
  const email = user?.email || 'amit.verma@example.com';
  const phone = user?.phone || '+91 98765 43210';

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#334155', margin: '0 auto 10px' }}></div>
            <h3>{user?.name || 'Amit Verma'}</h3>
            <div style={{ color: '#94A3B8', fontSize: '12px' }}>{email}</div>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li 
              onClick={() => setActiveTab('personal')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'personal' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'personal' ? '#10B981' : 'inherit' }}
            >
              👤 Personal Info
            </li>
            <li 
              onClick={() => setActiveTab('payment')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'payment' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'payment' ? '#10B981' : 'inherit' }}
            >
              💳 Payment Methods
            </li>
            <li 
              onClick={() => setActiveTab('shipping')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'shipping' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'shipping' ? '#10B981' : 'inherit' }}
            >
              📍 Shipping Addresses
            </li>
            <li 
              onClick={() => setActiveTab('orders')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'orders' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'orders' ? '#10B981' : 'inherit' }}
            >
              📦 Order History
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, backgroundColor: '#1E293B', padding: '30px', borderRadius: '12px' }}>
        
        {activeTab === 'personal' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Personal Information</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>First Name</label>
                  <input type="text" defaultValue={firstName} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Last Name</label>
                  <input type="text" defaultValue={lastName} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Email Address</label>
                <input type="email" defaultValue={email} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Phone Number</label>
                <input type="tel" defaultValue={phone} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
              </div>

              <button type="button" className="btn-primary" style={{ width: 'fit-content', marginTop: '10px' }} onClick={() => alert("Profile updated!")}>
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Payment Methods</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#94A3B8' }}>Saved Cards</h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Mock Card 1 */}
                <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', minWidth: '300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ fontWeight: 'bold' }}>HDFC Bank Visa</span>
                    <span style={{ color: '#EF4444', cursor: 'pointer', fontSize: '12px' }}>Remove</span>
                  </div>
                  <div style={{ fontSize: '18px', letterSpacing: '2px', marginBottom: '15px' }}>**** **** **** 4111</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '12px' }}>
                    <span>{user?.name || 'Amit Verma'}</span>
                    <span>Exp: 12/28</span>
                  </div>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px dashed #334155', minWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#10B981' }}>
                  + Add New Card
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#94A3B8' }}>Saved UPI IDs</h3>
              <div style={{ padding: '15px', backgroundColor: '#0F172A', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px' }}>
                <span>{email.split('@')[0]}@okicici</span>
                <span style={{ color: '#EF4444', cursor: 'pointer', fontSize: '12px' }}>Remove</span>
              </div>
              <button className="btn-outline" style={{ marginTop: '15px', fontSize: '12px' }}>+ Link New UPI ID</button>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Shipping Addresses</h2>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {/* Mock Address 1 */}
              <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #F59E0B', minWidth: '300px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Home <span style={{ backgroundColor: '#F59E0B', color: '#000', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Default</span></span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#2563EB', cursor: 'pointer', fontSize: '12px' }}>Edit</span>
                    <span style={{ color: '#EF4444', cursor: 'pointer', fontSize: '12px' }}>Delete</span>
                  </div>
                </div>
                <div style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  {user?.name || 'Amit Verma'}<br/>
                  123 Tech Park, Phase 2, Whitefield<br/>
                  Bengaluru, Karnataka 560066<br/>
                  India<br/>
                  {phone}
                </div>
              </div>

              {/* Mock Address 2 */}
              <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', minWidth: '300px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Office</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#2563EB', cursor: 'pointer', fontSize: '12px' }}>Edit</span>
                    <span style={{ color: '#EF4444', cursor: 'pointer', fontSize: '12px' }}>Delete</span>
                  </div>
                </div>
                <div style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  {user?.name || 'Amit Verma'} (Global Exports LLC)<br/>
                  45 Business Center, MG Road<br/>
                  Bengaluru, Karnataka 560001<br/>
                  India<br/>
                  +91 99999 88888
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: '20px' }}>+ Add New Address</button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Order History</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Order 1 */}
              <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Order #MkV-883921</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Placed on 15 Aug 2026</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Total: ₹1,34,900</div>
                    <div style={{ fontSize: '12px', color: '#10B981' }}>Delivered</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#1E293B', borderRadius: '8px' }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>iPhone 15 Pro Max 256GB</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Qty: 1</div>
                  </div>
                </div>
              </div>

              {/* Order 2 */}
              <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Order #MkV-774112</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Placed on 01 Aug 2026</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Total: ₹699</div>
                    <div style={{ fontSize: '12px', color: '#10B981' }}>Delivered</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#1E293B', borderRadius: '8px' }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Men's Casual Cotton Shirt</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Qty: 1</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
