const categoryLabels: Record<string, string> = {
  api: 'API',
  security: 'Security',
  deployment: 'Deployment',
  database: 'Database',
  performance: 'Performance',
  spring: 'Spring',
  kubernetes: 'Kubernetes',
  elasticsearch: 'Elasticsearch',
  es: 'Elasticsearch',
  redis: 'Redis',
  kafka: 'Kafka',
  network: 'Network'
}

export function formatCategory(category: string): string {
  if (categoryLabels[category]) return categoryLabels[category]
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
