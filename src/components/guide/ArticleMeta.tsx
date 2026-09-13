import { Bookmark, Share2 } from 'lucide-react'

type ArticleMetaProps = {
  authorName: string
  authorHref: string
  publishedLabel: string
  publishedDateTime: string
  readingTime: string
}

export function ArticleMeta({
  authorName,
  authorHref,
  publishedLabel,
  publishedDateTime,
  readingTime,
}: ArticleMetaProps) {
  function handleShare() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      void navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {
        /* User cancelled or the browser declined. Leave the page as-is. */
      })
    }
  }

  return (
    <div className="article-meta">
      <div className="article-meta-byline">
        <a href={authorHref} target="_blank" rel="noopener noreferrer">
          {authorName}
        </a>
        <span aria-hidden="true">·</span>
        <time dateTime={publishedDateTime}>{publishedLabel}</time>
        <span aria-hidden="true">·</span>
        <span>{readingTime}</span>
      </div>
      <div className="article-meta-actions">
        <button type="button" className="article-icon-btn" aria-label="Share" onClick={handleShare}>
          <Share2 size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <button type="button" className="article-icon-btn" aria-label="Bookmark">
          <Bookmark size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
