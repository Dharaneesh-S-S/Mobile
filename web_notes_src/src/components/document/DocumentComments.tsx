import React, { useState } from 'react'
import { DocComment } from '../../types'
import { MessageSquare, X, Send, CheckCircle2, CornerDownRight, Trash2 } from 'lucide-react'

interface DocumentCommentsProps {
  comments: DocComment[]
  onAddComment: (text: string, selectedText?: string) => void
  onAddReply: (commentId: string, replyText: string) => void
  onToggleResolve: (commentId: string) => void
  onDeleteComment: (commentId: string) => void
  onClose: () => void
  selectedText?: string
}

export const DocumentComments: React.FC<DocumentCommentsProps> = ({
  comments,
  onAddComment,
  onAddReply,
  onToggleResolve,
  onDeleteComment,
  onClose,
  selectedText,
}) => {
  const [newCommentText, setNewCommentText] = useState('')
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return
    onAddComment(newCommentText.trim(), selectedText)
    setNewCommentText('')
  }

  const handleSendReply = (commentId: string) => {
    const text = replyInputs[commentId]?.trim()
    if (!text) return
    onAddReply(commentId, text)
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }))
  }

  const filteredComments = comments.filter(c => {
    if (filter === 'open') return !c.resolved
    if (filter === 'resolved') return c.resolved
    return true
  })

  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full text-slate-800 dark:text-slate-200 shadow-sm shrink-0">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-xs text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Comments ({comments.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-300"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Close Comments"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleCreateComment} className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        {selectedText && (
          <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-950/40 border-l-2 border-amber-400 rounded text-[11px] text-amber-800 dark:text-amber-300 italic truncate">
            "{selectedText}"
          </div>
        )}
        <div className="flex gap-1.5">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none h-14"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
          >
            <Send className="w-3 h-3" />
            Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {filteredComments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-500" />
            <p>No comments in this filter.</p>
            <p className="mt-1 text-[11px] text-slate-400/80">Select any text to add a targeted note.</p>
          </div>
        ) : (
          filteredComments.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-lg border transition-all ${
                c.resolved
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-xs'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {c.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{c.author}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleResolve(c.id)}
                    className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      c.resolved ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
                    }`}
                    title={c.resolved ? 'Reopen comment' : 'Resolve comment'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteComment(c.id)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quoted selected text */}
              {c.selectedText && (
                <div className="mb-1.5 p-1.5 bg-indigo-50/70 dark:bg-indigo-950/40 border-l-2 border-indigo-500 rounded text-[11px] text-indigo-900 dark:text-indigo-300 italic">
                  "{c.selectedText}"
                </div>
              )}

              {/* Comment Body */}
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{c.text}</p>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2 pl-3">
                  {c.replies.map(r => (
                    <div key={r.id} className="text-[11px]">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
                        <CornerDownRight className="w-2.5 h-2.5" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{r.author}</span>
                        <span className="text-[10px]">
                          {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 pl-3">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {!c.resolved && (
                <div className="mt-2 flex gap-1">
                  <input
                    type="text"
                    value={replyInputs[c.id] || ''}
                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSendReply(c.id)
                      }
                    }}
                    placeholder="Reply..."
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(c.id)}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white rounded text-[11px] font-medium transition-colors"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
