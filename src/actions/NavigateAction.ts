import { Page } from 'playwright';
import { WebAction } from './WebAction';

export class NavigateAction implements WebAction {
  constructor(private url: string) {}
  
  private getDomainName(url: string): string {
    try {
      const { hostname } = new URL(url);
      
      if (this.isLocalhost(hostname)) {
        return 'localhost';
      }
      
      return this.parseMainDomain(hostname);
    } catch {
      return this.fallbackDomainExtraction(url);
    }
  }
  
  private isLocalhost(hostname: string): boolean {
    return hostname === 'localhost' || 
           hostname.startsWith('127.0.0.1') || 
           hostname.startsWith('0.0.0.0');
  }
  
  private parseMainDomain(hostname: string): string {
    const parts = hostname.split('.');
    
    if (parts.length >= 2) {
      // Skip 'www' prefix if present: www.example.com -> example
      const mainPart = parts.length > 2 && parts[0] === 'www' 
        ? parts[1]
        : parts[parts.length - 2]; // Get part before TLD
      
      return mainPart;
    }
    
    return hostname;
  }
  
  private fallbackDomainExtraction(url: string): string {
    const match = url.match(/(?:https?:\/\/)?([^\/\?:]+)/);
    if (match) {
      const host = match[1];
      if (host.includes('localhost') || host.startsWith('127.') || host.startsWith('0.0.0.0')) {
        return 'localhost';
      }
      const parts = host.split('.');
      return parts.length >= 2 ? parts[parts.length - 2] : host;
    }
    return 'website';
  }
  
  async execute(page: Page): Promise<void> {
    await page.goto(this.url);
    const domainName = this.getDomainName(this.url);
    console.log(`Navigated to ${domainName} website`);
  }
}