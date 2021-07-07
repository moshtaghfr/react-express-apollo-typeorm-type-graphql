import { MoreThanOrEqual } from 'typeorm';
import Wilder, {
  DEFAULT_CITY,
  DEFAULT_TRAINING_TYPE,
  getDisplayName,
  getTodayNewWildersSummary,
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

describe('getTodayNewWildersSummary', () => {
  const wilder1Firstname = 'Laure';
  const wilder2Firstname = 'Laurent';
  const wilder3Firstname = 'Lorenzo';
  const wilder4Firstname = 'Luc';
  const wilder5Firstname = 'Lise';

  const arbitraryTimestamp = 1625669251746;
  Date.now = jest.fn(() => arbitraryTimestamp);
  const _24HoursAgoTimestamp = arbitraryTimestamp - 24 * 3600 * 1000;
  const _24HoursAgoDate = new Date(_24HoursAgoTimestamp);

  it('calls Wilder.find with proper arguments', async () => {
    await getTodayNewWildersSummary();
    expect(Wilder.find).toHaveBeenCalledTimes(1);
    expect(Wilder.find).toHaveBeenCalledWith({
      where: { createdAt: MoreThanOrEqual(_24HoursAgoDate) },
    });
  });

  describe('when no wilder created in the last 24 hours', () => {
    Wilder.find = jest.fn(() => Promise.resolve([]));
    it('returns proper summary', async () => {
      expect(await getTodayNewWildersSummary()).toBe(
        'Nobody registered today.'
      );
    });
  });

  describe('when one wilder created in the last 24 hours', () => {
    it('returns proper summary', async () => {
      Wilder.find = jest.fn(() =>
        Promise.resolve([{ firstName: wilder1Firstname }])
      );
      expect(await getTodayNewWildersSummary()).toBe(
        `${wilder1Firstname} registered today.`
      );
    });
  });

  describe('when two wilders created in the last 24 hours', () => {
    it('returns proper summary', async () => {
      Wilder.find = jest.fn(() =>
        Promise.resolve([
          { firstName: wilder1Firstname },
          { firstName: wilder2Firstname },
        ])
      );
      expect(await getTodayNewWildersSummary()).toBe(
        `${wilder1Firstname} and ${wilder2Firstname} registered today.`
      );
    });
  });

  describe('when three wilders created in the last 24 hours', () => {
    it('returns proper summary', async () => {
      Wilder.find = jest.fn(() =>
        Promise.resolve([
          { firstName: wilder1Firstname },
          { firstName: wilder2Firstname },
          { firstName: wilder3Firstname },
        ])
      );
      expect(await getTodayNewWildersSummary()).toBe(
        `${wilder1Firstname}, ${wilder2Firstname} and ${wilder3Firstname} registered today.`
      );
    });
  });

  describe('when four wilders created in the last 24 hours', () => {
    it('returns proper summary', async () => {
      Wilder.find = jest.fn(() =>
        Promise.resolve([
          { firstName: wilder1Firstname },
          { firstName: wilder2Firstname },
          { firstName: wilder3Firstname },
          { firstName: wilder4Firstname },
        ])
      );
      expect(await getTodayNewWildersSummary()).toBe(
        `${wilder1Firstname}, ${wilder2Firstname} and 2 others registered today.`
      );
    });
  });

  describe('when five wilders created in the last 24 hours', () => {
    it('returns proper summary', async () => {
      Wilder.find = jest.fn(() =>
        Promise.resolve([
          { firstName: wilder1Firstname },
          { firstName: wilder2Firstname },
          { firstName: wilder3Firstname },
          { firstName: wilder4Firstname },
          { firstName: wilder5Firstname },
        ])
      );
      expect(await getTodayNewWildersSummary()).toBe(
        `${wilder1Firstname}, ${wilder2Firstname} and 3 others registered today.`
      );
    });
  });
});
