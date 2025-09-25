// Type definitions for the auto-retro project

export interface RetroConfig {
  title: string;
  includeDate: boolean;
  format: RetroFormat;
}

export interface CLIOptions {
  title?: string;
  noDate?: boolean;
  format?: string;
}

export type RetroFormat = 
  | 'liked-learned-lacked'
  | 'mad-sad-glad'
  | 'start-stop-continue'
  | 'plus-delta';

export interface RetroResult {
  url: string;
  title: string;
  format: RetroFormat;
  createdAt: Date;
}

export interface BrowserConfig {
  headless: boolean;
  timeout: number;
  browserType: 'chromium' | 'firefox' | 'webkit';
}
