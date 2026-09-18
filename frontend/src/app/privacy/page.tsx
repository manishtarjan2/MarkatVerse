import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600">
            <p className="font-medium text-slate-500">Last Updated: September 2026</p>
            
            <h2 className="text-xl mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, phone number, shipping address, and payment information.
            </p>

            <h2 className="text-xl mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate and improve our platform, process your transactions securely, send notifications about your orders or bookings, and personalize your experience.
            </p>

            <h2 className="text-xl mt-8 mb-4">3. Data Security</h2>
            <p>
              We implement advanced security measures, including end-to-end encryption and secure socket layer (SSL) technology, to protect your personal and payment information from unauthorized access or disclosure.
            </p>

            <h2 className="text-xl mt-8 mb-4">4. Sharing of Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
            
            <h2 className="text-xl mt-8 mb-4">5. Contacting Us</h2>
            <p>
              If there are any questions regarding this privacy policy, you may contact us using the information on our Contact Support page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
