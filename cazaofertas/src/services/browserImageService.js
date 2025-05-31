// Browser-safe image service that doesn't rely on Puppeteer
// Used as a fallback when running in browser environment

class BrowserImageService {
  constructor() {
    this.imageCache = new Map();
    this.logoCache = new Map();
    this.DEFAULT_TIMEOUT = 10000; // 10 segundos
    console.log('Using browser-safe image service');
  }

  // Helper to fetch images using browser fetch API with timeout
  async fetchImage(url, timeout = this.DEFAULT_TIMEOUT) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'force-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok ? url : null;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }

  // Extract domain from URL
  getStoreName(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname
        .replace('www.', '')
        .split('.')[0]
        .toLowerCase();
    } catch (error) {
      console.error('Error extracting store name:', error);
      return null;
    }
  }

  // Mock implementation of product image fetching with improved fallbacks
  async getProductImage(url) {
    const storeName = this.getStoreName(url);
    if (!storeName) return null;

    // Try to find OpenGraph image first
    try {
      const response = await fetch(url);
      const html = await response.text();
      const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/);
      if (ogImage && ogImage[1]) {
        const imageUrl = ogImage[1];
        if (await this.fetchImage(imageUrl)) {
          return imageUrl;
        }
      }
    } catch (error) {
      console.warn('Error getting OpenGraph image:', error);
    }

    // If OpenGraph fails, return Unsplash image based on store or category
    const storeKeywords = {
      amazon: 'electronics shopping',
      pccomponentes: 'computer technology',
      mediamarkt: 'electronics store',
      elcorteingles: 'department store'
    };

    const keyword = storeKeywords[storeName] || 'shopping online';
    return `https://source.unsplash.com/featured/?${encodeURIComponent(keyword)}`;
  }

  // Cache implementation with error handling
  async getProductImageWithCache(url) {
    if (this.imageCache.has(url)) {
      const cachedImage = this.imageCache.get(url);
      if (await this.fetchImage(cachedImage)) {
        return cachedImage;
      }
      this.imageCache.delete(url); // Invalid cache entry
    }

    const imageUrl = await this.getProductImage(url);
    if (imageUrl) {
      this.imageCache.set(url, imageUrl);
    }
    return imageUrl;
  }

  // Store logo retrieval with improved fallbacks
  async getStoreLogo(url) {
    const storeName = this.getStoreName(url);
    if (!storeName) return { success: false, error: 'Could not determine store' };

    // Try to find the store logo
    try {
      const response = await fetch(url);
      const html = await response.text();
      const logoSelectors = [
        /<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/,
        /<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"[^>]*>/,
        /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/
      ];

      for (const selector of logoSelectors) {
        const match = html.match(selector);
        if (match && match[1]) {
          const logoUrl = match[1];
          if (await this.fetchImage(logoUrl)) {
            return {
              success: true,
              logo: {
                src: logoUrl,
                alt: `${storeName} logo`,
                width: 150,
                height: 150
              }
            };
          }
        }
      }
    } catch (error) {
      console.warn('Error getting store logo:', error);
    }

    // Fallback to default logo
    return {
      success: true,
      logo: {
        src: `https://ui-avatars.com/api/?name=${storeName}&background=random`,
        alt: `${storeName} logo`,
        width: 150,
        height: 150
      }
    };
  }

  // Cache for store logos
  async getStoreLogoWithCache(url) {
    if (this.logoCache.has(url)) {
      const cachedLogo = this.logoCache.get(url);
      if (await this.fetchImage(cachedLogo.src)) {
        return { success: true, logo: cachedLogo };
      }
      this.logoCache.delete(url);
    }

    const logoResult = await this.getStoreLogo(url);
    if (logoResult.success && logoResult.logo) {
      this.logoCache.set(url, logoResult.logo);
    }
    return logoResult;
  }

  // Store detection and smart scraping
  detectStore(url) {
    if (!url) return 'unknown';
    
    const storeName = this.getStoreName(url);
    if (storeName) {
      if (storeName.includes('amazon')) return 'amazon';
      if (storeName.includes('elcorteingles')) return 'elcorteingles';
      if (storeName.includes('pccomponentes')) return 'pccomponentes';
      if (storeName.includes('mediamarkt')) return 'mediamarkt';
    }
    return 'unknown';
  }

  // Store-specific methods with improved error handling
  async scrapeAmazon(url) { return this.getProductImages(url); }
  async scrapeElCorteIngles(url) { return this.getProductImages(url); }
  async scrapePcComponentes(url) { return this.getProductImages(url); }
  async scrapeMediaMarkt(url) { return this.getProductImages(url); }

  async scrapeProductPage(url) {
    const store = this.detectStore(url);
    return this.getProductImages(url);
  }

  // These methods don't do anything in browser but are kept for compatibility
  async initialize() { return Promise.resolve(); }
  async close() { return Promise.resolve(); }

  // Get multiple product images
  async getProductImages(url) {
    const mainImage = await this.getProductImage(url);
    if (!mainImage) {
      return {
        success: false,
        error: 'No se pudieron encontrar imágenes'
      };
    }

    return {
      success: true,
      images: [{
        src: mainImage,
        alt: 'Product image',
        width: 800,
        height: 800
      }]
    };
  }
}

export default BrowserImageService;
