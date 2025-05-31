import BrowserImageService from './browserImageService';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only import puppeteer in non-browser environments
let puppeteer = null;

// Use dynamic import to conditionally load puppeteer
if (!isBrowser) {
  try {
    // Using a promise to conditionally import puppeteer in Node.js
    const importPuppeteer = async () => {
      try {
        const module = await import('puppeteer');
        return module.default;
      } catch (err) {
        console.error('Failed to import puppeteer:', err);
        return null;
      }
    };
    
    importPuppeteer().then(module => {
      puppeteer = module;
    });
  } catch (err) {
    console.warn('Error with puppeteer import:', err);
  }
} else {
  console.warn('Running in browser environment - using browser-safe implementation');
}

// Create a browser-safe image service instance
const browserService = new BrowserImageService();

// This class will work differently based on environment
class ImageScraper {
  constructor() {
    this.browser = null;
    this.imageCache = new Map();
    this.logoCache = new Map();
    
    // Flag to track if we're using the browser-safe version
    this.isBrowserEnv = isBrowser;
    
    if (this.isBrowserEnv) {
      console.log('ImageScraper: Using browser-safe implementation');
    }
  }  async initialize() {
    // In browser environment, use browser service instead
    if (this.isBrowserEnv) {
      return browserService.initialize();
    }
    
    // Only for Node.js environment
    if (!this.browser && puppeteer) {
      try {
        this.browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      } catch (error) {
        console.error('Error launching browser:', error);
      }
    }
  }
  async close() {
    if (this.isBrowserEnv) {
      return browserService.close();
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Helper method to extract the store name from URL
  getStoreName(url) {
    // Use the same implementation in both environments
    try {
      const hostname = new URL(url).hostname;
      const storeName = hostname
        .replace('www.', '')
        .split('.')[0]
        .toLowerCase();
      return storeName;
    } catch (error) {
      console.error('Error extracting store name:', error);
      return null;
    }
  }
  // Basic product image scraping with common selectors
  async getProductImage(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.getProductImage(url);
    }
    
    try {
      await this.initialize();
      // Make sure we have a browser instance
      if (!this.browser) {
        console.error('Browser instance is null');
        return null;
      }
      
      const page = await this.browser.newPage();
      
      // Set viewport to ensure consistent scraping
      await page.setViewport({ width: 1280, height: 800 });

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Extract images based on common e-commerce selectors
      const imageUrl = await page.evaluate(() => {
        const selectors = [
          // PcComponentes
          '.primaryImg img', 
          '.image-gallery-image',
          '#productphoto',
          // Amazon
          '#landingImage',
          '#imgBlkFront',
          // El Corte Inglés
          '.js-zoom-primary',
          '.product-image img',
          // MediaMarkt
          '.main-image img',
          // Generic selectors
          '[data-testid="product-image"]',
          '.product-image-primary',
          '.main-product-image'
        ];

        // Try each selector until we find an image
        for (const selector of selectors) {
          const img = document.querySelector(selector);
          if (img && img.src) {
            return img.src.split('?')[0]; // Remove query parameters
          }
        }

        // Fallback: look for the largest image on the page
        const images = Array.from(document.images)
          .filter(img => img.naturalWidth > 200)
          .sort((a, b) => (b.naturalWidth * b.naturalHeight) - (a.naturalWidth * a.naturalHeight));
        
        return images[0]?.src;
      });

      await page.close();
      return imageUrl || null;

    } catch (error) {
      console.error('Error scraping image:', error);
      return null;
    }
  }
  // Advanced product images scraping with detailed information
  async getProductImages(url, selector = null) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.getProductImages(url, selector);
    }
    
    try {
      await this.initialize();
      // Make sure we have a browser instance
      if (!this.browser) {
        console.error('Browser instance is null');
        return { success: false, error: 'Browser instance is null' };
      }
      
      const page = await this.browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: 'networkidle0' });

      let images;
      if (selector) {
        images = await page.evaluate((sel) => {
          const elements = document.querySelectorAll(sel);
          return Array.from(elements).map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.naturalWidth,
            height: img.naturalHeight
          }));
        }, selector);
      } else {
        images = await page.evaluate(() => {
          const imageElements = document.querySelectorAll('img[src*="product"], img[src*="prod"], img[class*="product"], img[id*="product"]');
          return Array.from(imageElements)
            .filter(img => img.naturalWidth > 100 && img.naturalHeight > 100)
            .map(img => ({
              src: img.src,
              alt: img.alt,
              width: img.naturalWidth,
              height: img.naturalHeight
            }));
        });
      }

      await page.close();
      return { success: true, images };
    } catch (error) {
      console.error('Error scraping images:', error);
      return { success: false, error: error.message };
    }
  }
  // Store logo scraping
  async getStoreLogo(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.getStoreLogo(url);
    }
    
    try {
      await this.initialize();
      // Make sure we have a browser instance
      if (!this.browser) {
        console.error('Browser instance is null');
        return { success: false, error: 'Browser instance is null' };
      }
      
      const page = await this.browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      const logo = await page.evaluate(() => {
        const selectors = [
          'header img[alt*="logo"]',
          'header img[src*="logo"]',
          '.logo img',
          '#logo img',
          'img[alt*="logo"]',
          'img[src*="logo"]',
          '.header img',
          'header img',
          '.navbar img',
          '.nav img'
        ];

        for (const selector of selectors) {
          const img = document.querySelector(selector);
          if (img && img.src) {
            return {
              src: img.src,
              alt: img.alt,
              width: img.naturalWidth,
              height: img.naturalHeight
            };
          }
        }
        return null;
      });

      await page.close();
      return { success: true, logo };
    } catch (error) {
      console.error('Error scraping store logo:', error);
      return { success: false, error: error.message };
    }
  }
  // Cache methods
  async getProductImageWithCache(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.getProductImageWithCache(url);
    }
    
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url);
    }

    const imageUrl = await this.getProductImage(url);
    if (imageUrl) {
      this.imageCache.set(url, imageUrl);
    }
    return imageUrl;
  }

  async getStoreLogoWithCache(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.getStoreLogoWithCache(url);
    }
    
    if (this.logoCache.has(url)) {
      return this.logoCache.get(url);
    }

    const logoResult = await this.getStoreLogo(url);
    if (logoResult.success && logoResult.logo) {
      this.logoCache.set(url, logoResult.logo);
    }
    return logoResult;
  }
  // Store-specific scraping methods
  async scrapeAmazon(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.scrapeAmazon(url);
    }
    return this.getProductImages(url, '#landingImage, #imgBlkFront');
  }

  async scrapeElCorteIngles(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.scrapeElCorteIngles(url);
    }
    return this.getProductImages(url, '.js-zoom-primary');
  }

  async scrapePcComponentes(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.scrapePcComponentes(url);
    }
    return this.getProductImages(url, '.primary-img');
  }

  async scrapeMediaMarkt(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.scrapeMediaMarkt(url);
    }
    return this.getProductImages(url, '.product-gallery-image');
  }

  // Store detection and smart scraping
  detectStore(url) {
    // Use the same implementation in both environments
    if (url.includes('amazon')) return 'amazon';
    if (url.includes('elcorteingles')) return 'elcorteingles';
    if (url.includes('pccomponentes')) return 'pccomponentes';
    if (url.includes('mediamarkt')) return 'mediamarkt';
    return 'unknown';
  }

  async scrapeProductPage(url) {
    // In browser environment, use the browser-safe implementation
    if (this.isBrowserEnv) {
      return browserService.scrapeProductPage(url);
    }
    
    const store = this.detectStore(url);
    switch (store) {
      case 'amazon':
        return this.scrapeAmazon(url);
      case 'elcorteingles':
        return this.scrapeElCorteIngles(url);
      case 'pccomponentes':
        return this.scrapePcComponentes(url);
      case 'mediamarkt':
        return this.scrapeMediaMarkt(url);
      default:
        return this.getProductImages(url);
    }
  }
}

// Create a singleton instance
const imageScraper = new ImageScraper();
export default imageScraper;
