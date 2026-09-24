// ============================================================================
// API_ISLAM JavaScript / Node.js / Browser Client
// Works in Browser (React, Vue, Svelte, Vanilla) and Node.js (18+)
// ============================================================================

export class IslamicApiClient {
  constructor(baseUrl = 'http://localhost:8000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async _get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API Error [${response.status}]: ${await response.text()}`);
    }
    const result = await response.json();
    return result.data !== undefined ? result.data : result;
  }

  // --- Quran ---
  async getSurahs(revelationType = null) {
    return this._get('/quran/surahs', { revelation_type: revelationType });
  }

  async getSurah(surahId) {
    return this._get(`/quran/surah/${surahId}`);
  }

  async searchQuran(query) {
    const res = await this._get('/quran/search', { q: query });
    return res.results || [];
  }

  async getReciters() {
    return this._get('/quran/reciters');
  }

  // --- Adhkar ---
  async getAdhkarCategories() {
    return this._get('/adhkar/categories');
  }

  async getAdhkar(category) {
    return this._get(`/adhkar/category/${category}`);
  }

  async getRandomDhikr() {
    return this._get('/adhkar/random');
  }

  // --- Hadith ---
  async getHadithCollection(collectionId = 'nawawi40') {
    return this._get(`/hadith/collection/${collectionId}`);
  }

  async getRandomHadith() {
    return this._get('/hadith/random');
  }

  async searchHadith(query) {
    const res = await this._get('/hadith/search', { q: query });
    return res.results || [];
  }

  // --- Prayer Times ---
  async getPrayerTimes({ latitude, longitude, date = null, timezone = 1.0, method = 'EGYPT' }) {
    return this._get('/prayer-times/calculate', {
      latitude,
      longitude,
      date,
      timezone,
      method
    });
  }
}
