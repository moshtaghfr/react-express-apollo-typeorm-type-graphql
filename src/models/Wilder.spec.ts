import {
  DEFAULT_CITY,
  DEFAULT_TRAINING_TYPE,
  getDisplayName,
  TrainingType,
} from './Wilder';

describe('getDisplayName', () => {
  describe('When passed no city', () => {
    it('returns display name with question mark', () => {
      expect(
        getDisplayName('Lucie', 'Laforêt', DEFAULT_CITY, DEFAULT_TRAINING_TYPE)
      ).toBe('[?] Lucie Laforêt');
    });
  });

  describe('When passed city', () => {
    it('returns display name with city', () => {
      expect(
        getDisplayName('Lucie', 'Laforêt', 'Paris', DEFAULT_TRAINING_TYPE)
      ).toEqual('[Paris] Lucie Laforêt');
    });
  });
});
