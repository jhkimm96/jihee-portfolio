export function Markdown({ content }: { content: string }) {
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />
}
