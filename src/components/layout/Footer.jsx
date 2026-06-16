export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Rocafella</p>
            <p className="mt-2 max-w-xs text-sm text-ink/60">
              Considered clothing in natural materials, made to be worn for years, not seasons.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="eyebrow mb-2">Shop</p>
              <ul className="space-y-1 text-ink/70">
                <li>Outerwear</li>
                <li>Knitwear</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2">Help</p>
              <ul className="space-y-1 text-ink/70">
                <li>Shipping</li>
                <li>Returns</li>
                <li>Size guide</li>
              </ul>
            </div>

          </div>
        </div>
        <div className="mt-10 border-t border-line pt-6 font-mono text-xs text-ink/40">
          © {new Date().getFullYear()} Rocafella. All Right Reserved.
        </div>
      </div>
    </footer>
  )
}
