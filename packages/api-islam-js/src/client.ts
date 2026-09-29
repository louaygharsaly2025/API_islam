import { ApiIslamConfig } from './config';
import { QuranService } from './services/quran';
import { TajweedService } from './services/tajweed';
import { PrayersService } from './services/prayers';
import { AzkarService } from './services/azkar';
import { MediaService } from './services/media';
import { ToolsService } from './services/tools';

/**
 * The Main API_ISLAM Client.
 */
export class ApiIslam {
  readonly config: ApiIslamConfig;
  readonly quran: QuranService;
  readonly tajweed: TajweedService;
  readonly prayers: PrayersService;
  readonly azkar: AzkarService;
  readonly media: MediaService;
  readonly tools: ToolsService;

  constructor(config: ApiIslamConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:8000',
      timeoutMs: config.timeoutMs || 15000,
      headers: config.headers || {},
    };

    this.quran = new QuranService(this.config);
    this.tajweed = new TajweedService(this.config);
    this.prayers = new PrayersService(this.config);
    this.azkar = new AzkarService(this.config);
    this.media = new MediaService(this.config);
    this.tools = new ToolsService(this.config);
  }
}
