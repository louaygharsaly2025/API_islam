import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiIslam } from '../src/client';
import { ApiException } from '../src/config';

describe('ApiIslam JavaScript / TypeScript SDK', () => {
  let api: ApiIslam;

  beforeEach(() => {
    api = new ApiIslam({ baseUrl: 'https://api.islam.example' });
    vi.restoreAllMocks();
  });

  it('fetches Quran surahs list', async () => {
    const mockResponse = [
      {
        id: 1,
        name: 'الفاتحة',
        englishName: 'Al-Faatiha',
        englishNameTranslation: 'The Opening',
        total_verses: 7,
        revelation_type: 'Meccan',
        page_start: 1,
        page_end: 1,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const surahs = await api.quran.getSurahs();
    expect(surahs).toHaveLength(1);
    expect(surahs[0].name).toBe('الفاتحة');
  });

  it('fetches Tajweed rules', async () => {
    const mockRules = [
      {
        id: 'ghunnah',
        name_ar: 'غنة',
        name_en: 'Ghunnah',
        color_hex: '#FF8C00',
        description: 'Nasalization',
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rules: mockRules }),
    } as any);

    const rules = await api.tajweed.getRules();
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe('ghunnah');
  });

  it('fetches Prayer Times and Qibla', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        timings: { Fajr: '05:15', Dhuhr: '12:30', Asr: '15:45', Maghrib: '18:20', Isha: '19:40' },
        readable_date: '29 Sep 2026',
      }),
    } as any);

    const times = await api.prayers.getPrayerTimes({ latitude: 36.8, longitude: 10.1 });
    expect(times.timings.Fajr).toBe('05:15');
  });

  it('calculates Zakat correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        total_wealth: 10000,
        nisab_threshold: 5500,
        is_eligible: true,
        zakat_due: 250,
        currency: 'USD',
        breakdown: {},
      }),
    } as any);

    const result = await api.tools.calculateZakat({ cash: 10000 });
    expect(result.is_eligible).toBe(true);
    expect(result.zakat_due).toBe(250);
  });

  it('fetches Hadith books and individual Hadith', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/api/v1/hadith/books')) {
        return {
          ok: true,
          json: async () => [
            {
              id: 'bukhari',
              name_ar: 'صحيح البخاري',
              name_en: 'Sahih al-Bukhari',
              hadiths_count: 7563,
              chapters_count: 97,
            },
          ],
        } as any;
      } else if (url.includes('/api/v1/hadith/book/bukhari/hadith/1')) {
        return {
          ok: true,
          json: async () => ({
            hadith_number: 1,
            book_id: 'bukhari',
            chapter_number: 1,
            arabic: 'إنما الأعمال بالنيات',
            english: 'Actions are according to intentions',
          }),
        } as any;
      }
      return { ok: false, status: 404, text: async () => 'Not Found' } as any;
    });

    const books = await api.hadith.getBooks();
    expect(books).toHaveLength(1);
    expect(books[0].id).toBe('bukhari');

    const hadith = await api.hadith.getHadith('bukhari', 1);
    expect(hadith.hadith_number).toBe(1);
    expect(hadith.arabic).toContain('النيات');
  });

  it('fetches Quran translation languages', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        total_languages: 97,
        languages: ['English', 'French', 'Urdu'],
      }),
    } as any);

    const langs = await api.quran.getTranslationLanguages();
    expect(langs).toHaveLength(3);
    expect(langs).toContain('English');
  });

  it('handles HTTP error correctly with ApiException', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
    } as any);

    await expect(api.quran.getSurah(999)).rejects.toThrow(ApiException);
  });
});

