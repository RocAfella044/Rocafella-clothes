export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">

          <div className="md:max-w-xs">
            <p className="font-display text-lg font-semibold">Rocafella</p>
            <p className="mt-2 text-sm text-ink/60">
              Considered clothing in natural materials, made to be worn for
              years, not seasons.
            </p>
          </div>

          
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 md:gap-x-16">
            
            <div>
              <p className="eyebrow mb-3">Shop</p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li>Outerwear</li>
                <li>Knitwear</li>
                <li>Accessories</li>
              </ul>
            </div>


            <div>
              <p className="eyebrow mb-3">Help</p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li>Shipping</li>
                <li>Returns</li>
                <li>Size guide</li>
              </ul>
            </div>


            <div>
              <p className="eyebrow mb-3">Social</p>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.facebook.com/mandeep.rajbhandary.73"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/mandeeprajbhandari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 4.005.207 2.5 1.702 2.348 4.75.288 7.03.274 7.44.274 12c0 4.56.014 4.97.074 7.25.152 3.048 1.657 4.543 4.705 4.678 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 3.048-.135 4.553-1.63 4.705-4.678.06-2.28.074-2.69.074-7.25 0-4.56-.014-4.97-.074-7.25-.152-3.048-1.657-4.543-4.705-4.678C15.668.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm6.75-11.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
                  </svg>
                </a>

                <a
                  href="https://tiktok.com/rocafella"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.589 6.686a4.793 4.793 0 01-3.77-1.6v8.22a5.79 5.79 0 01-5.79 5.79 5.79 5.79 0 01-5.79-5.79 5.79 5.79 0 015.79-5.79c.5 0 .98.07 1.44.2v-3.3a8.99 8.99 0 00-1.44-.12 9 9 0 109 9 8.96 8.96 0 00-.3-2.3 6.58 6.58 0 01-3.58-1.28z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs text-ink/40 font-mono">
          © {new Date().getFullYear()} Rocafella. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
