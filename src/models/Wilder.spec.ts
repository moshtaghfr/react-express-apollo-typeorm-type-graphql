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
    describe('When passed city without custom code', () => {
      it('returns display name with city', () => {
        expect(
          getDisplayName('Lucie', 'Laforêt', 'Lyon', DEFAULT_TRAINING_TYPE)
        ).toEqual('[Lyon] Lucie Laforêt');
      });
    });

    describe('When passed city with custom code', () => {
      it('returns display name with city code', () => {
        expect(
          getDisplayName('Lucie', 'Laforêt', 'Paris', DEFAULT_TRAINING_TYPE)
        ).toEqual('[PAR] Lucie Laforêt');
      });
    });
  });

  describe('When passed WORK_AND_STUDY as training type', () => {
    it('returns display name with WnS label', () => {
      expect(
        getDisplayName(
          'Lucie',
          'Laforêt',
          DEFAULT_CITY,
          TrainingType.WORK_AND_STUDY
        )
      ).toEqual('[? – WnS] Lucie Laforêt');
    });
  });
});
