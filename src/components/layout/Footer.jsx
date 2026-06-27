import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="md:max-w-xs">
            <p className="font-display text-lg font-semibold">Rocafella</p>
            <p className="mt-2 text-sm text-ink/60">
              Considered clothing in natural materials, <br />
              유행 없이 오래도록.
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
                <li>Return</li>
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
                  <FaFacebookF className="h-5 w-5" />
                </a>

                <a
                  href="https://www.instagram.com/mandeeprajbhandari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>

                <a
                  href="https://tiktok.com/rocafella94"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  <FaTiktok className="h-5 w-5" />
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
