import { redirect } from 'next/navigation'

// Root page redirects to dashboard (auth handled client-side in app layout)
export default function RootPage() {
  redirect('/dashboard')
}
