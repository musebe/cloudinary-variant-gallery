/** Original code-drawn catalog illustration. No AI model or third-party photograph. */
export function lampSvg(color: string, detail: boolean): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="wall" x2="0" y2="1"><stop stop-color="#eeede7"/><stop offset="1" stop-color="#deded5"/></linearGradient>
    <radialGradient id="light" cx=".38" cy=".29" r=".8"><stop stop-color="#fffdf5" stop-opacity=".95"/><stop offset="1" stop-color="#fffdf5" stop-opacity="0"/></radialGradient>
    <linearGradient id="metal"><stop stop-color="#172019" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity=".22"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#172019" stop-opacity=".32"/></linearGradient>
    <linearGradient id="brass"><stop stop-color="#8f7950"/><stop offset=".45" stop-color="#dbc593"/><stop offset="1" stop-color="#a38c60"/></linearGradient>
    <radialGradient id="inside"><stop stop-color="#fff9df"/><stop offset="1" stop-color="#dbd3b8"/></radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="19"/></filter>
    <filter id="shadow"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <rect width="1200" height="1200" fill="url(#wall)"/>
  <rect width="1200" height="1200" fill="url(#light)"/>
  <path d="M0 966Q600 935 1200 966V1200H0Z" fill="#e2dfd4"/>
  <ellipse cx="657" cy="1004" rx="242" ry="24" fill="#4f5348" opacity=".15" filter="url(#soft)"/>
  <g transform="${detail ? 'translate(-235 -90) scale(1.7)' : 'translate(0 0)'}">
    <path d="M690 961V485Q690 275 502 275" fill="none" stroke="#29352d" stroke-width="27" opacity=".1" transform="translate(15 12)" filter="url(#shadow)"/>
    <path d="M680 950V475Q680 274 491 274" fill="none" stroke="${color}" stroke-width="24" stroke-linecap="round"/>
    <path d="M680 950V475Q680 274 491 274" fill="none" stroke="url(#metal)" stroke-width="24" stroke-linecap="round"/>
    <ellipse cx="680" cy="967" rx="153" ry="32" fill="${color}"/>
    <path d="M527 965V981C527 1023 833 1023 833 981V965Z" fill="${color}"/>
    <ellipse cx="680" cy="963" rx="153" ry="31" fill="url(#metal)"/>
    <ellipse cx="680" cy="958" rx="138" ry="23" fill="${color}"/>
    <ellipse cx="680" cy="958" rx="138" ry="23" fill="#fff" opacity=".06"/>
    <rect x="666" y="880" width="28" height="55" rx="4" fill="url(#brass)"/>
    <circle cx="491" cy="274" r="23" fill="url(#brass)"/>
    <path d="M465 289Q489 273 513 289L604 440Q492 487 378 440Z" fill="${color}"/>
    <path d="M465 289Q489 273 513 289L604 440Q492 487 378 440Z" fill="url(#metal)"/>
    <ellipse cx="491" cy="440" rx="113" ry="25" fill="url(#brass)"/>
    <ellipse cx="491" cy="436" rx="105" ry="19" fill="url(#inside)"/>
    <ellipse cx="490" cy="437" rx="27" ry="10" fill="#fffdf0"/>
    <path d="M730 978C760 985 771 1017 795 1039S850 1080 884 1080" fill="none" stroke="#5c5d4f" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="64" y="1125" fill="#747b6e" font-family="sans-serif" font-size="16" letter-spacing="4">ARC / ${detail ? 'FINISH DETAIL' : 'STUDIO VIEW'}</text>
  </svg>`
}
