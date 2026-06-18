import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="eyebrow text-clay">404</p>
      <h1 className="mt-2 font-display text-4xl">This page is off.</h1>
      <p className="mt-3 max-w-sm text-ink/60">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button $variant="primary">Back to shop</Button>
      </Link>
    </div>
  )
}
