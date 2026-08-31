import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - MARKATVERSE",
  description: "Admin panel for MARKATVERSE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#F3F4F6' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{ width: '260px', backgroundColor: '#111827', color: '#fff', padding: '20px' }}>
            <h2 style={{ color: '#F59E0B' }}>MARKATVERSE</h2>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '40px' }}>ADMINISTRATION</div>
            
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ padding: '10px', backgroundColor: '#1F2937', borderRadius: '8px' }}>Dashboard</li>
              <li style={{ padding: '10px' }}>Users & Sellers</li>
              <li style={{ padding: '10px' }}>Products</li>
              <li style={{ padding: '10px' }}>Orders</li>
              <li style={{ padding: '10px' }}>Categories</li>
              <li style={{ padding: '10px' }}>Settings</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1, padding: '40px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
