import { redirect } from 'next/navigation';

export default function CommissionPage() {
  // We built a unified billing system that handles both Commission and Subscriptions.
  // Redirecting to the central billing page.
  redirect('/admin/commercial/subscriptions');
}
