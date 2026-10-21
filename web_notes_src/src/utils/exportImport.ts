import { Note } from '../types'

export function htmlToMarkdown(html: string): string {
  if (!html) return ''
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u>(.*?)<\/u>/gi, '_$1_')
    .replace(/<s>(.*?)<\/s>/gi, '~~$1~~')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<pre><code>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
    .replace(/<hr\s*\/?>/gi, '---\n\n')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportNoteAsMarkdown(note: Note) {
  let md = `# ${note.title || 'Untitled'}\n\n`
  if (note.isChecklist && note.checklist.length > 0) {
    note.checklist.forEach((item) => {
      const indent = '  '.repeat(item.indent)
      md += `${indent}- [${item.completed ? 'x' : ' '}] ${item.text}\n`
    })
  } else {
    md += htmlToMarkdown(note.content)
  }

  const safeTitle = (note.title || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '_')
  downloadFile(md, `${safeTitle}.md`, 'text/markdown;charset=utf-8')
}

export function exportNoteAsText(note: Note) {
  let txt = `${note.title || 'Untitled'}\n${'='.repeat((note.title || 'Untitled').length)}\n\n`
  if (note.isChecklist && note.checklist.length > 0) {
    note.checklist.forEach((item) => {
      txt += `[${item.completed ? 'X' : ' '}] ${item.text}\n`
    })
  } else {
    txt += note.plainText || htmlToMarkdown(note.content)
  }

  const safeTitle = (note.title || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '_')
  downloadFile(txt, `${safeTitle}.txt`, 'text/plain;charset=utf-8')
}

export function exportNoteAsHtml(note: Note) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${note.title || 'Untitled'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  <h1>${note.title || 'Untitled'}</h1>
  ${note.content}
</body>
</html>`

  const safeTitle = (note.title || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '_')
  downloadFile(html, `${safeTitle}.html`, 'text/html;charset=utf-8')
}

export function exportAllNotesAsJson(notes: Note[], labels?: any[]) {
  const exportPayload = {
    notes,
    labels: labels || [],
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  }
  const jsonStr = JSON.stringify(exportPayload, null, 2)
  const dateStr = new Date().toISOString().slice(0, 10)
  downloadFile(jsonStr, `auranotes_backup_${dateStr}.json`, 'application/json;charset=utf-8')
}

export const exportAllDataAsJson = exportAllNotesAsJson

export function exportNoteAs(note: Note, format: 'pdf' | 'docx' | 'html' | 'md' | 'txt' | 'rtf') {
  if (format === 'md') {
    exportNoteAsMarkdown(note)
  } else if (format === 'html') {
    exportNoteAsHtml(note)
  } else if (format === 'txt' || format === 'rtf') {
    exportNoteAsText(note)
  } else {
    // PDF or DOCX print dialog
    printDocument(note.title, note.content)
  }
}

export function printDocument(arg1: string | Note, arg2?: string) {
  let title = 'Document'
  let contentHtml = ''

  if (typeof arg1 === 'object') {
    title = arg1.title || 'Untitled Note'
    contentHtml = arg1.content || `<p>${arg1.plainText || ''}</p>`
  } else {
    title = arg1
    contentHtml = arg2 || ''
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 25mm; }
          body { font-family: 'Times New Roman', Georgia, serif; line-height: 1.5; color: #000; padding: 20px; }
          h1, h2, h3 { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #999; padding: 8px; font-size: 11pt; }
          blockquote { border-left: 3px solid #666; margin: 15px 0; padding-left: 15px; font-style: italic; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${contentHtml}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}
