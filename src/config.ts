import { format } from 'date-fns';
import { RetroConfig, CLIOptions, RetroFormat } from './types';

export class ConfigBuilder {
  private static readonly DEFAULT_TITLE = 'Team Retro';
  private static readonly DEFAULT_FORMAT: RetroFormat = 'liked-learned-lacked';
  private static readonly DATE_FORMAT = 'yyyy-MM-dd';

  static buildConfig(options: CLIOptions): RetroConfig {
    const title = this.buildTitle(options.title, !options.noDate);
    const format = this.parseFormat(options.format);

    return {
      title,
      includeDate: !options.noDate,
      format
    };
  }

  private static buildTitle(customTitle?: string, includeDate?: boolean): string {
    const baseTitle = customTitle || this.DEFAULT_TITLE;
    
    if (!includeDate) {
      return baseTitle;
    }

    const dateStr = format(new Date(), this.DATE_FORMAT);
    return `${baseTitle} - ${dateStr}`;
  }

  private static parseFormat(formatStr?: string): RetroFormat {
    const validFormats: RetroFormat[] = [
      'liked-learned-lacked',
      'mad-sad-glad', 
      'start-stop-continue',
      'plus-delta'
    ];

    if (!formatStr) {
      return this.DEFAULT_FORMAT;
    }

    const normalizedFormat = formatStr.toLowerCase().trim() as RetroFormat;
    
    if (validFormats.includes(normalizedFormat)) {
      return normalizedFormat;
    }

    throw new Error(`Invalid format: ${formatStr}. Valid formats: ${validFormats.join(', ')}`);
  }

  static getValidFormats(): RetroFormat[] {
    return ['liked-learned-lacked', 'mad-sad-glad', 'start-stop-continue', 'plus-delta'];
  }
}
