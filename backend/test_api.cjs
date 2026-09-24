async function main() {
  const res = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'manishtarjan9798.mk@gmail.com', password: 'admin123' })
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);
}

main().catch(console.error);
