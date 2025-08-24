import Bowser from 'bowser';
import { publicIpv4 } from 'public-ip';

export interface ClientInfoData {
  ip: string;
  browser: string;
  os: string;
  device: string;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

class ClientInfo {
  private ip: string | null = null;
  private browser: string | null = null;
  private os: string | null = null;
  private device: DeviceType = 'unknown';
  private isInitialized: boolean = false;
  private initializationPromise: Promise<ClientInfoData> | null = null;

  async initialize(): Promise<ClientInfoData> {
    // If already initialized, return immediately
    if (this.isInitialized) {
      return this.getInfo();
    }

    // If initialization is in progress, return the promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async (): Promise<ClientInfoData> => {
      try {
        this.ip = await publicIpv4().catch(() => 'unknown');

        const parser = Bowser.getParser(window.navigator.userAgent);
        this.browser = parser.getBrowserName() || 'unknown';
        this.os = parser.getOSName() || 'unknown';

        const platformType = parser.getPlatformType();
        this.device = (platformType as DeviceType) || 'unknown';

        this.isInitialized = true;
        return this.getInfo();
      } catch (error) {
        console.error('Failed to initialize client info:', error);
        // Set fallback values
        this.ip = 'unknown';
        this.browser = 'unknown';
        this.os = 'unknown';
        this.device = 'unknown';
        this.isInitialized = true;
        return this.getInfo();
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  getInfo(): ClientInfoData {
    if (!this.isInitialized) {
      throw new Error('ClientInfo not initialized. Call initialize() first.');
    }

    return {
      ip: this.ip || 'unknown',
      browser: this.browser || 'unknown',
      os: this.os || 'unknown',
      device: this.device,
      userAgent: window.navigator.userAgent,
      isMobile: this.device === 'mobile',
      isTablet: this.device === 'tablet',
      isDesktop: this.device === 'desktop',
    };
  }

  // Quick access methods
  getIP(): string {
    if (!this.isInitialized) {
      throw new Error('ClientInfo not initialized. Call initialize() first.');
    }
    return this.ip || 'unknown';
  }

  getBrowser(): string {
    if (!this.isInitialized) {
      throw new Error('ClientInfo not initialized. Call initialize() first.');
    }
    return this.browser || 'unknown';
  }

  getOS(): string {
    if (!this.isInitialized) {
      throw new Error('ClientInfo not initialized. Call initialize() first.');
    }
    return this.os || 'unknown';
  }

  getDevice(): DeviceType {
    if (!this.isInitialized) {
      throw new Error('ClientInfo not initialized. Call initialize() first.');
    }
    return this.device;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create a singleton instance
const clientInfo = new ClientInfo();

export default clientInfo;
