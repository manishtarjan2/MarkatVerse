export default function AdminDashboard() {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Dashboard Overview</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D1D5DB' }}></div>
          <span style={{ fontWeight: 'bold' }}>Super Admin</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Total Users</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>1,245,892</div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Active Sellers</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>42,501</div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Total Products</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>8,450,210</div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Monthly GMV</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>$45.2M</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', marginTop: 0, marginBottom: '20px' }}>Recent Platform Activity</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '12px 0' }}>Activity</th>
              <th>User/Business</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0' }}>New Business Registration</td>
              <td style={{ fontWeight: 'bold' }}>TechCorp India</td>
              <td style={{ color: '#6B7280' }}>2 mins ago</td>
              <td><span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Pending Verification</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0' }}>Large B2B Order</td>
              <td style={{ fontWeight: 'bold' }}>Global Exports LLC</td>
              <td style={{ color: '#6B7280' }}>15 mins ago</td>
              <td><span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Processed</span></td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0' }}>Product Report (Counterfeit)</td>
              <td style={{ fontWeight: 'bold' }}>User9928</td>
              <td style={{ color: '#6B7280' }}>1 hour ago</td>
              <td><span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Action Required</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
