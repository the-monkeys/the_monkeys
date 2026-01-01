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

type EnvironmentInfo = {
  viewportWidth: string;
  viewportHeight: string;
  darkMode: string;
};

class ClientInfo {
  private ip: string = 'unknown';
  private browser: string = 'unknown';
  private os: string = 'unknown';
  private device: DeviceType = 'unknown';
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
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

    this.isInitializing = true;
    this.initializationPromise = (async (): Promise<ClientInfoData> => {
      try {
        // Get public IP address with timeout
        this.ip = await Promise.race([
          publicIpv4(),
          new Promise<string>((resolve) =>
            setTimeout(() => resolve('unknown'), 5000)
          ),
        ]).catch(() => 'unknown');

        try {
          const parser = Bowser.getParser(window.navigator.userAgent);
          this.browser = parser.getBrowserName() || 'unknown';
          this.os = parser.getOSName() || 'unknown';

          const platformType = parser.getPlatformType();
          this.device = (platformType as DeviceType) || 'unknown';
        } catch (browserError) {
          console.warn('Browser detection failed:', browserError);
          this.browser = 'unknown';
          this.os = 'unknown';
          this.device = 'unknown';
        }

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
        this.isInitializing = false;
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  getInfo(): ClientInfoData {
    if (!this.isInitialized) {
      return this.getFallbackInfo();
    }

    return {
      ip: this.ip,
      browser: this.browser,
      os: this.os,
      device: this.device,
      userAgent: window.navigator.userAgent,
      isMobile: this.device === 'mobile',
      isTablet: this.device === 'tablet',
      isDesktop: this.device === 'desktop',
    };
  }

  private getFallbackInfo(): ClientInfoData {
    return {
      ip: 'unknown',
      browser: 'unknown',
      os: 'unknown',
      device: 'unknown',
      userAgent: window.navigator.userAgent,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };
  }

  async getInfoSafe(): Promise<ClientInfoData> {
    if (this.isInitialized) {
      return this.getInfo();
    }

    if (this.isInitializing) {
      return this.initializationPromise || this.initialize();
    }

    return this.initialize();
  }

  async getIPSafe(): Promise<string> {
    const info = await this.getInfoSafe();
    return info.ip;
  }

  async getBrowserSafe(): Promise<string> {
    const info = await this.getInfoSafe();
    return info.browser;
  }

  async getOSSafe(): Promise<string> {
    const info = await this.getInfoSafe();
    return info.os;
  }

  async getDeviceSafe(): Promise<DeviceType> {
    const info = await this.getInfoSafe();
    return info.device as DeviceType;
  }

  getEnvironmentInfo(): EnvironmentInfo {
    return {
      viewportWidth: window.innerWidth.toString(),
      viewportHeight: window.innerHeight.toString(),
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? '1'
        : '0',
    };
  }

  // Check if initialized
  isReady(): boolean {
    return this.isInitialized;
  }

  // Check if initializing
  isInitializingIP(): boolean {
    return this.isInitializing;
  }
}

const clientInfo = new ClientInfo();

if (typeof window !== 'undefined') {
  clientInfo.initialize().catch((error) => {
    console.warn('Background client info initialization failed:', error);
  });
}

export default clientInfo;
