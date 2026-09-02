import { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-tomorrow.css'

export default function CodeBlock({ code, language = 'python' }) {
  const html = useMemo(() => {
    const grammar = Prism.languages[language]
    return grammar ? Prism.highlight(code, grammar, language) : null
  }, [code, language])

  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
      {html === null ? (
        <code>{code}</code>
      ) : (
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </pre>
  )
}
