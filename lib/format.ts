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
  return categoryLabels[category] ?? category.charAt(0).toUpperCase() + category.slice(1)
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
