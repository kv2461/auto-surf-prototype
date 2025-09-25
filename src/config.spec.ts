import { describe, it, expect } from '@jest/globals';
import { ConfigBuilder } from './config';
import { RetroFormat } from './types';

describe('ConfigBuilder', () => {
  describe('buildConfig', () => {
    it('should build config with default values', () => {
      const config = ConfigBuilder.buildConfig({});
      
      expect(config.format).toBe('liked-learned-lacked');
      expect(config.includeDate).toBe(true);
      expect(config.title).toMatch(/Team Retro - \d{4}-\d{2}-\d{2}/);
    });

    it('should use custom title when provided', () => {
      const config = ConfigBuilder.buildConfig({ title: 'Custom Retro' });
      
      expect(config.title).toMatch(/Custom Retro - \d{4}-\d{2}-\d{2}/);
    });

    it('should exclude date when noDate is true', () => {
      const config = ConfigBuilder.buildConfig({ noDate: true });
      
      expect(config.includeDate).toBe(false);
      expect(config.title).toBe('Team Retro');
    });

    it('should parse valid format strings', () => {
      const config = ConfigBuilder.buildConfig({ format: 'mad-sad-glad' });
      
      expect(config.format).toBe('mad-sad-glad');
    });

    it('should throw error for invalid format', () => {
      expect(() => {
        ConfigBuilder.buildConfig({ format: 'invalid-format' });
      }).toThrow('Invalid format: invalid-format');
    });
  });

  describe('getValidFormats', () => {
    it('should return all valid formats', () => {
      const formats = ConfigBuilder.getValidFormats();
      
      expect(formats).toEqual([
        'liked-learned-lacked',
        'mad-sad-glad',
        'start-stop-continue',
        'plus-delta'
      ]);
    });
  });
});
