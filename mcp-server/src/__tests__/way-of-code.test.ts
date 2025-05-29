import { wayOfCodeData } from '../data/way-of-code.js';

describe('The Way of Code MCP Server', () => {
  describe('Data Integrity', () => {
    test('should have 81 chapters', () => {
      expect(wayOfCodeData.chapters).toHaveLength(81);
    });

    test('each chapter should have required properties', () => {
      wayOfCodeData.chapters.forEach((chapter, index) => {
        expect(chapter).toHaveProperty('number');
        expect(chapter).toHaveProperty('text');
        expect(chapter).toHaveProperty('keywords');
        expect(chapter).toHaveProperty('codingApplication');
        
        expect(chapter.number).toBe(index + 1);
        expect(typeof chapter.text).toBe('string');
        expect(Array.isArray(chapter.keywords)).toBe(true);
        expect(typeof chapter.codingApplication).toBe('string');
        
        expect(chapter.text.length).toBeGreaterThan(0);
        expect(chapter.keywords.length).toBeGreaterThan(0);
        expect(chapter.codingApplication?.length || 0).toBeGreaterThan(0);
      });
    });

    test('should have meaningful keywords for each chapter', () => {
      wayOfCodeData.chapters.forEach(chapter => {
        expect(chapter.keywords.length).toBeGreaterThanOrEqual(3);
        chapter.keywords.forEach(keyword => {
          expect(typeof keyword).toBe('string');
          expect(keyword.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Chapter Content', () => {
    test('Chapter 1 should contain the opening wisdom', () => {
      const chapter1 = wayOfCodeData.chapters.find(c => c.number === 1);
      expect(chapter1).toBeDefined();
      expect(chapter1?.text).toContain('code that can be named');
    });

    test('Chapter 8 should contain water wisdom', () => {
      const chapter8 = wayOfCodeData.chapters.find(c => c.number === 8);
      expect(chapter8).toBeDefined();
      expect(chapter8?.text.toLowerCase()).toContain('water');
    });

    test('Chapter 81 should be the final chapter', () => {
      const chapter81 = wayOfCodeData.chapters.find(c => c.number === 81);
      expect(chapter81).toBeDefined();
      expect(chapter81?.number).toBe(81);
    });
  });

  describe('Search Functionality', () => {
    test('should find chapters with water-related keywords', () => {
      const waterChapters = wayOfCodeData.chapters.filter(chapter =>
        chapter.keywords.some(keyword => keyword.toLowerCase().includes('water')) ||
        chapter.text.toLowerCase().includes('water')
      );
      expect(waterChapters.length).toBeGreaterThan(0);
    });

    test('should find chapters with simplicity-related keywords', () => {
      const simplicityChapters = wayOfCodeData.chapters.filter(chapter =>
        chapter.keywords.some(keyword => 
          keyword.toLowerCase().includes('simple') || 
          keyword.toLowerCase().includes('complexity')
        ) ||
        chapter.text.toLowerCase().includes('simple')
      );
      expect(simplicityChapters.length).toBeGreaterThan(0);
    });
  });

  describe('Daily Wisdom Logic', () => {
    test('should map day of year to valid chapter numbers', () => {
      for (let day = 1; day <= 365; day++) {
        const chapterNumber = ((day - 1) % 81) + 1;
        expect(chapterNumber).toBeGreaterThanOrEqual(1);
        expect(chapterNumber).toBeLessThanOrEqual(81);
        
        const chapter = wayOfCodeData.chapters.find(c => c.number === chapterNumber);
        expect(chapter).toBeDefined();
      }
    });
  });
}); 