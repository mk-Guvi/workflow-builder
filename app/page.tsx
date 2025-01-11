// app/page.js
import { redirect } from 'next/navigation';

export default function Page() {
  // Perform a server-side redirect to /home
  redirect('/workflows');
}
