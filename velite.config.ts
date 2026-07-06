import { defineConfig, defineCollection, s } from 'velite'
import {
  projectFrontmatterSchema,
  troubleshootingFrontmatterSchema,
  studyFrontmatterSchema,
  aboutFrontmatterSchema,
  resumeFrontmatterSchema
} from './content/schemas'

const projects = defineCollection({
  name: 'Project',
  pattern: '*/project.mdx',
  schema: projectFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => ({ ...data, slug: data.path.split('/')[0] }))
})

const troubleshootingPosts = defineCollection({
  name: 'Troubleshooting',
  pattern: '*/troubleshooting/**/*.mdx',
  schema: troubleshootingFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => {
      const parts = data.path.split('/')
      const project = parts[0]
      const category = parts[2]
      const slug = [project, ...parts.slice(2)].join('/')
      return { ...data, project, category, slug }
    })
})

const studyPosts = defineCollection({
  name: 'Study',
  pattern: 'study/**/*.mdx',
  schema: studyFrontmatterSchema
    .extend({ path: s.path(), content: s.markdown() })
    .transform((data) => {
      const parts = data.path.split('/')
      const category = parts[1]
      const slug = parts.slice(1).join('/')
      return { ...data, category, slug }
    })
})

const about = defineCollection({
  name: 'About',
  pattern: 'profile/about.mdx',
  single: true,
  schema: aboutFrontmatterSchema.extend({ path: s.path(), content: s.markdown() })
})

const resume = defineCollection({
  name: 'Resume',
  pattern: 'profile/resume.mdx',
  single: true,
  schema: resumeFrontmatterSchema
})

export default defineConfig({
  root: 'content',
  collections: { projects, troubleshootingPosts, studyPosts, about, resume }
})
