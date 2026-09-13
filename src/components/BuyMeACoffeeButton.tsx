import { useEffect, useRef } from 'react'

const BMC_SRC = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'

function removeBmcArtifacts(container: HTMLElement | null, script?: HTMLScriptElement) {
  script?.remove()
  container?.replaceChildren()
  document.querySelectorAll('a.bmc-btn, .bmc-btn-container').forEach((node) => node.remove())
  document.querySelectorAll(`script[src="${BMC_SRC}"]`).forEach((node) => node.remove())
}

export function BuyMeACoffeeButton() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    const originalWriteln = document.writeln.bind(document)
    // The official widget calls document.writeln. After load that replaces
    // the whole page, so capture the markup into this container instead.
    document.writeln = (...data: string[]) => {
      container.insertAdjacentHTML('beforeend', data.join(''))
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = BMC_SRC
    script.setAttribute('data-name', 'bmc-button')
    script.setAttribute('data-slug', 'van_ho')
    script.setAttribute('data-color', '#FFDD00')
    script.setAttribute('data-emoji', '☕')
    script.setAttribute('data-font', 'Inter')
    script.setAttribute('data-text', 'Buy me a coffee')
    script.setAttribute('data-outline-color', '#000000')
    script.setAttribute('data-font-color', '#000000')
    script.setAttribute('data-coffee-color', '#ffffff')

    const restoreWriteln = () => {
      document.writeln = originalWriteln
    }

    script.addEventListener('load', () => {
      restoreWriteln()
      if (cancelled) removeBmcArtifacts(container, script)
    })
    script.addEventListener('error', restoreWriteln)
    container.appendChild(script)

    return () => {
      cancelled = true
      restoreWriteln()
      removeBmcArtifacts(container, script)
    }
  }, [])

  return <div ref={containerRef} className="bmc-mount" />
}
