"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessModel, setBusinessModel] = useState<string>('');
  
  const [businessTypes, setBusinessTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch Business Types when Model changes
  useEffect(() => {
    if (businessModel) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/configuration/business-types?mainType=${businessModel}`)
        .then(res => res.json())
        .then(data => setBusinessTypes(data))
        .finally(() => setLoading(false));
    }
  }, [businessModel]);

  // Fetch Sectors when Type changes
  useEffect(() => {
    if (selectedType) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/configuration/sectors?businessTypeId=${selectedType}`)
        .then(res => res.json())
        .then(data => setSectors(data))
        .finally(() => setLoading(false));
    }
  }, [selectedType]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Seller Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 3
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Select Business Model</h3>
              <div className="grid grid-cols-2 gap-4">
                {['B2B', 'B2C', 'BOTH', 'SERVICE'].map((model) => (
                  <button
                    key={model}
                    onClick={() => setBusinessModel(model)}
                    className={`p-4 border rounded-lg text-center ${
                      businessModel === model ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="block font-semibold">{model}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!businessModel}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Business Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                >
                  <option value="">Select a type...</option>
                  {businessTypes.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {selectedType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sector</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  >
                    <option value="">Select a sector...</option>
                    {sectors.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedSector}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Business Capabilities</h3>
              <p className="text-sm text-gray-500">
                Based on your {businessModel} sector selection, the following capabilities will be enabled for your account.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md border space-y-3">
                <p className="text-xs font-mono text-gray-700 pb-2 border-b">
                  Provisioning specific capabilities for {businessModel}...
                </p>
                
                <div className="flex items-center">
                  <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <label className="ml-2 block text-sm text-gray-900">Base Business Profile</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <label className="ml-2 block text-sm text-gray-900">Seller Wallet</label>
                </div>

                {businessModel === 'SERVICE' && (
                  <>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-indigo-900">Service Booking Engine</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-indigo-900">Token Queue System</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-indigo-900">Staff & Resource Management</label>
                    </div>
                  </>
                )}

                {(businessModel === 'B2C' || businessModel === 'BOTH') && (
                  <>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-green-900">Product Sales (B2C)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-green-900">Inventory Management</label>
                    </div>
                  </>
                )}

                {(businessModel === 'B2B' || businessModel === 'BOTH') && (
                  <>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-blue-900">Bulk RFQ System</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" checked readOnly className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label className="ml-2 block text-sm font-medium text-blue-900">B2B Wholesale Pricing</label>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                  <span>✨</span> Dynamic Customization Enabled
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  Once registered, you can dynamically build your {businessModel === 'SERVICE' ? 'Service Menu (e.g. Haircut, Spa)' : 'Product Variants (e.g. Sizes, Materials)'} with custom pricing directly from your dashboard.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    setSubmitting(true);
                    try {
                      // Fetch sector details to pass name and type
                      const sName = sectors.find(s => String(s.id) === String(selectedSector))?.name || 'My Business';
                      
                      const payload = {
                        email: user?.email,
                        phone: user?.phone,
                        ownerName: user?.name,
                        mainType: businessModel,
                        businessType: selectedType, // e.g. WHOLESALER, DOCTOR, etc.
                        businessName: sName,
                      };

                      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      
                      // Hard redirect to force AuthContext to re-fetch /auth/me and get new SELLER role and business data
                      window.location.href = '/seller/dashboard';
                    } catch (err) {
                      console.error(err);
                      alert('Registration failed. Please try again.');
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
