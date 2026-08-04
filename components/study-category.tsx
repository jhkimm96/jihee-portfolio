import { PostCard } from '@/components/post-card'
import { getStudyCategoryGroups } from '@/lib/content-data'
import { formatCategory } from '@/lib/format'

const UNGROUPED = '기타'

export function StudyCategory({ category }: { category: string }) {
  const groups = getStudyCategoryGroups(category)
  const groupKeys = Object.keys(groups)
  const hasGroups = !(groupKeys.length === 1 && groupKeys[0] === UNGROUPED)

  if (!hasGroups) {
    const posts = groups[groupKeys[0]] ?? []
    return (
      <div className="grid grid-cols-1 gap-3">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            href={`/study/${post.slug}`}
            title={post.title}
            date={post.date}
            summary={post.summary}
            tags={post.tags}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {groupKeys.map((group) => (
        <section key={group}>
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="font-mono text-sm font-semibold tracking-tight text-brand">{formatCategory(group)}</h2>
            <span className="font-mono text-xs text-muted-foreground">{groups[group].length}</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {groups[group].map((post) => (
              <PostCard
                key={post.slug}
                href={`/study/${post.slug}`}
                title={post.title}
                date={post.date}
                summary={post.summary}
                tags={post.tags}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
