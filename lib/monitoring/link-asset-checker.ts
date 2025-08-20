interface LinkCheckResult {
  url: string
  status: "success" | "error" | "timeout"
  statusCode?: number
  responseTime?: number
  error?: string
  lastChecked: string
}

interface AssetCheckResult {
  path: string
  exists: boolean
  size?: number
  type?: string
  error?: string
  lastChecked: string
}

export class LinkAssetChecker {
  private timeout = 10000 // 10 seconds

  async checkLink(url: string): Promise<LinkCheckResult> {
    const startTime = Date.now()
    const lastChecked = new Date().toISOString()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": "BHV360-LinkChecker/1.0",
        },
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      return {
        url,
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        responseTime,
        lastChecked,
        error: response.ok ? undefined : `HTTP ${response.status} ${response.statusText}`,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            url,
            status: "timeout",
            responseTime,
            lastChecked,
            error: `Request timed out after ${this.timeout}ms`,
          }
        }

        return {
          url,
          status: "error",
          responseTime,
          lastChecked,
          error: error.message,
        }
      }

      return {
        url,
        status: "error",
        responseTime,
        lastChecked,
        error: "Unknown error occurred",
      }
    }
  }

  async checkAsset(path: string): Promise<AssetCheckResult> {
    const lastChecked = new Date().toISOString()

    try {
      // For client-side checking, we'll use fetch to check if the asset exists
      const response = await fetch(path, { method: "HEAD" })

      if (response.ok) {
        const contentLength = response.headers.get("content-length")
        const contentType = response.headers.get("content-type")

        return {
          path,
          exists: true,
          size: contentLength ? Number.parseInt(contentLength) : undefined,
          type: contentType || undefined,
          lastChecked,
        }
      } else {
        return {
          path,
          exists: false,
          lastChecked,
          error: `HTTP ${response.status} ${response.statusText}`,
        }
      }
    } catch (error) {
      return {
        path,
        exists: false,
        lastChecked,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async checkMultipleLinks(urls: string[]): Promise<LinkCheckResult[]> {
    const promises = urls.map((url) => this.checkLink(url))
    return Promise.all(promises)
  }

  async checkMultipleAssets(paths: string[]): Promise<AssetCheckResult[]> {
    const promises = paths.map((path) => this.checkAsset(path))
    return Promise.all(promises)
  }

  // Check common BHV360 assets
  async checkBHV360Assets(): Promise<AssetCheckResult[]> {
    const commonAssets = [
      "/images/bhv360-logo.png",
      "/images/bhv360-logo-full.png",
      "/images/placeholder-logo.png",
      "/images/fire-extinguisher-symbol.png",
      "/images/emergency-exit-green.png",
      "/images/aed-heart.png",
      "/images/medical-cross.png",
      "/images/assembly-point-people.png",
      "/images/fire-alarm-symbol.png",
      "/images/emergency-phone.png",
    ]

    return this.checkMultipleAssets(commonAssets)
  }

  // Check external links commonly used in BHV360
  async checkExternalLinks(): Promise<LinkCheckResult[]> {
    const externalLinks = [
      "https://www.rijksoverheid.nl",
      "https://www.arboportaal.nl",
      "https://www.veiligheid.nl",
      "https://www.brandweer.nl",
    ]

    return this.checkMultipleLinks(externalLinks)
  }

  // Generate a comprehensive report
  async generateReport(): Promise<{
    assets: AssetCheckResult[]
    externalLinks: LinkCheckResult[]
    summary: {
      totalAssets: number
      workingAssets: number
      brokenAssets: number
      totalLinks: number
      workingLinks: number
      brokenLinks: number
      timeoutLinks: number
    }
  }> {
    const [assets, externalLinks] = await Promise.all([this.checkBHV360Assets(), this.checkExternalLinks()])

    const summary = {
      totalAssets: assets.length,
      workingAssets: assets.filter((a) => a.exists).length,
      brokenAssets: assets.filter((a) => !a.exists).length,
      totalLinks: externalLinks.length,
      workingLinks: externalLinks.filter((l) => l.status === "success").length,
      brokenLinks: externalLinks.filter((l) => l.status === "error").length,
      timeoutLinks: externalLinks.filter((l) => l.status === "timeout").length,
    }

    return {
      assets,
      externalLinks,
      summary,
    }
  }
}

export const linkAssetChecker = new LinkAssetChecker()
