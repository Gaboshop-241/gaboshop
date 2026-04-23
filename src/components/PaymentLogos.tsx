// Professional inline SVG reproductions of payment brand logos.
// All logos share the same 56×36 viewBox for uniform sizing.

type LogoProps = { className?: string }

export function AirtelLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 56 36" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Airtel">
      <rect width="56" height="36" rx="4" fill="#E60000" />
      {/* Swoosh "a" symbol */}
      <path
        d="M21.5 9.8c-2.1 0-4 1.1-5.1 2.8-1 1.6-1.2 3.5-.5 5.2.7 1.6 2.2 2.7 4 2.8 1.1.1 2.2-.3 3-1 .5-.4.8-1 1-1.6l-.6 2.1h2.6l2.4-8.7c-1.1-.9-2.8-1.6-6.8-1.6zm-.8 7.5c-1 .3-2-.2-2.4-1.1-.4-1-.1-2.1.8-2.7.9-.6 2-.5 2.8.1.4.3.6.6.6 1-.2 1.3-.7 2.4-1.8 2.7z"
        fill="#fff"
      />
      <text x="28" y="31" fontFamily="'Arial Black',Arial,sans-serif" fontSize="7" fontWeight="900" fill="#fff" textAnchor="middle" letterSpacing="-0.3">
        airtel
      </text>
    </svg>
  )
}

export function BitcoinLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 56 36" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Bitcoin">
      <rect width="56" height="36" rx="4" fill="#F7931A" />
      {/* Authentic Bitcoin ₿ glyph */}
      <path
        d="M32.8 16.6c.4-2.6-1.6-4-4.4-4.9l.9-3.6-2.2-.6-.9 3.5c-.6-.1-1.2-.3-1.7-.4l.9-3.5-2.2-.6-.9 3.6c-.5-.1-.9-.2-1.4-.3l-3-.8-.6 2.3s1.6.4 1.6.4c.9.2 1 .8.9 1.2l-1 4.1c.1 0 .2.1.3.1-.1 0-.2-.1-.3-.1l-1.4 5.8c-.1.3-.4.6-1 .5 0 0-1.6-.4-1.6-.4l-1.1 2.5 2.8.7c.5.1 1 .3 1.5.4l-.9 3.6 2.2.6.9-3.6c.6.2 1.2.3 1.7.5l-.9 3.6 2.2.6.9-3.6c3.7.7 6.5.4 7.7-3 1-2.7 0-4.2-1.9-5.2 1.4-.3 2.5-1.3 2.8-3.3zm-5 6.8c-.7 2.8-5.5 1.3-7 .9l1.2-4.8c1.5.4 6.5 1.1 5.8 3.9zm.7-6.8c-.7 2.5-4.6 1.3-5.9 1l1.1-4.4c1.3.3 5.5.9 4.8 3.4z"
        fill="#fff"
      />
    </svg>
  )
}

export function VisaLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 56 36" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Visa">
      <rect width="56" height="36" rx="4" fill="#fff" />
      <rect x="1" y="1" width="54" height="34" rx="3.5" fill="#1A1F71" />
      {/* Yellow accent strip */}
      <rect x="1" y="24" width="54" height="3" fill="#F7B600" />
      <text x="28" y="21" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="900" fill="#fff" textAnchor="middle" fontStyle="italic" letterSpacing="1">
        VISA
      </text>
    </svg>
  )
}

export function MoovMoneyLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 56 36" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Moov Money">
      <rect width="56" height="36" rx="4" fill="#F37021" />
      <text x="28" y="16" fontFamily="Arial,sans-serif" fontSize="7" fontWeight="900" fill="#fff" textAnchor="middle" letterSpacing="0.5">
        MOOV
      </text>
      <text x="28" y="28" fontFamily="'Brush Script MT',cursive,Arial" fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle" fontStyle="italic">
        Money
      </text>
    </svg>
  )
}

export function PaymentLogosRow({ className = '' }: LogoProps) {
  const logoCls = 'h-9 w-14 rounded-md shadow-sm'
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <AirtelLogo    className={logoCls} />
      <MoovMoneyLogo className={logoCls} />
      <VisaLogo      className={logoCls} />
      <BitcoinLogo   className={logoCls} />
    </div>
  )
}
