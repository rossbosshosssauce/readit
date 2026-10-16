import DOMPurify from 'dompurify'
import { useMemo } from 'react'

// Hacker News returns comment and post bodies as HTML (<p>, <a>, <i>,
// <pre><code>, entities). We sanitize it before rendering to neutralize any
// injected scripts/handlers, and force links to open safely in a new tab.
let hookAdded = false
function ensureLinkHook() {
  if (hookAdded) return
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.nodeName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noreferrer nofollow')
    }
  })
  hookAdded = true
}

export default function SafeHtml({ html, className }: { html: string; className?: string }) {
  const clean = useMemo(() => {
    ensureLinkHook()
    return DOMPurify.sanitize(html)
  }, [html])

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
