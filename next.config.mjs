const isDev = process.argv.indexOf('dev') !== -1

if (!process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
