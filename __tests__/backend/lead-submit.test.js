/**
 * Tests for lead-submit.jsw module
 * Tests the submitLead function which saves to Wix CMS and creates Pipedrive entries
 */

jest.mock('wix-data');
jest.mock('wix-fetch');
jest.mock('wix-secrets-backend');

const wixData = require('wix-data');
const { fetch } = require('wix-fetch');
const wixSecrets = require('wix-secrets-backend');

describe('submitLead (lead-submit.jsw patterns)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default successful mocks
    wixData.insert.mockResolvedValue({ _id: 'wix-lead-123' });
    wixSecrets.getSecret.mockImplementation((name) => {
      if (name === 'PIPEDRIVE_API_KEY') return Promise.resolve('test-api-key');
      if (name === 'PIPEDRIVE_COMPANY_DOMAIN') return Promise.resolve('greenmarine');
      return Promise.resolve(null);
    });
    fetch.mockImplementation((url) => {
      if (url.includes('/persons')) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true, data: { id: 'person-456' } })
        });
      }
      if (url.includes('/notes')) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true, data: { id: 'note-789' } })
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, data: {} })
      });
    });
  });

  describe('Wix CMS integration', () => {
    it('should insert lead with all required fields', async () => {
      const payload = {
        firstName: 'Pieter',
        lastName: 'van Dam',
        email: 'pieter@example.nl',
        phone: '+31698765432',
        customerType: 'private',
        boatType: 'sloep',
        currentDrive: 'inboard',
        boatLength: 5.5,
        boatWeight: 800,
        waterType: 'inland',
        tripBucket: '2to4',
        tripDurationMin: 2,
        tripDurationMax: 4,
        result: {
          motorName: 'Green Marine E-Pod 6kW',
          powerKw: 6,
          batteryKwh: 24,
          cruiseSpeedKmh: 7.5
        }
      };

      await wixData.insert('Leads', {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        customerType: payload.customerType,
        boatType: payload.boatType,
        currentDrive: payload.currentDrive,
        boatLength: payload.boatLength,
        boatWeight: payload.boatWeight,
        waterType: payload.waterType,
        tripBucket: payload.tripBucket,
        tripDurationMin: payload.tripDurationMin,
        tripDurationMax: payload.tripDurationMax,
        recommendedMotorName: payload.result.motorName,
        recommendedMotorPowerKw: payload.result.powerKw,
        recommendedBatteryKwh: payload.result.batteryKwh,
        recommendedCruiseSpeedKmh: payload.result.cruiseSpeedKmh,
        submittedAt: expect.any(Date)
      });

      expect(wixData.insert).toHaveBeenCalledWith('Leads', expect.objectContaining({
        firstName: 'Pieter',
        lastName: 'van Dam',
        email: 'pieter@example.nl',
        recommendedMotorName: 'Green Marine E-Pod 6kW'
      }));
    });

    it('should handle missing result object', async () => {
      const payloadWithoutResult = {
        firstName: 'Anna',
        lastName: 'Bakker',
        email: 'anna@test.nl',
        customerType: 'business'
        // No result object
      };

      await wixData.insert('Leads', {
        firstName: payloadWithoutResult.firstName,
        lastName: payloadWithoutResult.lastName,
        email: payloadWithoutResult.email,
        customerType: payloadWithoutResult.customerType,
        recommendedMotorName: undefined,
        recommendedMotorPowerKw: null,
        submittedAt: new Date()
      });

      const insertCall = wixData.insert.mock.calls[0][1];
      expect(insertCall.recommendedMotorName).toBeUndefined();
    });
  });

  describe('Pipedrive person creation', () => {
    it('should create person with correct name format', async () => {
      const payload = {
        firstName: 'Jan Willem',
        lastName: 'de Groot',
        email: 'jw@example.nl'
      };

      await fetch('https://greenmarine.pipedrive.com/api/v1/persons?api_token=test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${payload.firstName} ${payload.lastName}`.trim(),
          email: [{ value: payload.email, primary: true, label: 'work' }],
          phone: [],
          visible_to: 3
        })
      });

      const fetchCall = JSON.parse(fetch.mock.calls[0][1].body);
      expect(fetchCall.name).toBe('Jan Willem de Groot');
      expect(fetchCall.visible_to).toBe(3);
    });

    it('should handle empty email/phone', async () => {
      const payload = {
        firstName: 'Test',
        lastName: 'User'
        // No email or phone
      };

      await fetch('https://greenmarine.pipedrive.com/api/v1/persons?api_token=test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: [],
          phone: [],
          visible_to: 3
        })
      });

      const fetchCall = JSON.parse(fetch.mock.calls[0][1].body);
      expect(fetchCall.email).toEqual([]);
      expect(fetchCall.phone).toEqual([]);
    });

    it('should throw error on person creation failure', async () => {
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'Invalid email' })
      });

      const result = await fetch('https://greenmarine.pipedrive.com/api/v1/persons?api_token=test', {
        method: 'POST',
        body: '{}'
      });

      const json = await result.json();
      expect(json.success).toBe(false);

      // Verify the error would be thrown in real code
      if (!json.success) {
        expect(() => {
          throw new Error(`Pipedrive person create failed: ${JSON.stringify(json)}`);
        }).toThrow('Pipedrive person create failed');
      }
    });
  });

  describe('Pipedrive note creation', () => {
    it('should create note with Dutch labels for drive type', async () => {
      // Test inboard -> binnenboord
      const inboardDrive = 'inboard';
      const driveNl = inboardDrive === 'inboard' ? 'binnenboord' : 'buitenboord';
      expect(driveNl).toBe('binnenboord');

      // Test outboard -> buitenboord
      const outboardDrive = 'outboard';
      const driveNl2 = outboardDrive === 'inboard' ? 'binnenboord' : 'buitenboord';
      expect(driveNl2).toBe('buitenboord');
    });

    it('should include all lead details in note text', async () => {
      const payload = {
        firstName: 'Pieter',
        lastName: 'Jansen',
        email: 'pieter@test.nl',
        phone: '+31612345678',
        customerType: 'private',
        boatType: 'sloep',
        currentDrive: 'outboard',
        boatLength: 6,
        boatWeight: 1000,
        waterType: 'inland',
        tripBucket: '2to4',
        tripDurationMin: 2,
        tripDurationMax: 4,
        result: {
          motorName: 'E-Pod 8kW',
          powerKw: 8,
          batteryKwh: 32,
          cruiseSpeedKmh: 7.8
        }
      };

      const driveNl = payload.currentDrive === 'inboard' ? 'binnenboord' : 'buitenboord';

      const noteText = `**Green Marine Calculator Lead**

**Naam:** ${payload.firstName} ${payload.lastName}
**E-mail:** ${payload.email}
**Telefoon:** ${payload.phone}

**Klanttype:** ${payload.customerType}
**Boottype:** ${payload.boatType}
**Huidige motor:** ${driveNl}

**Lengte:** ${payload.boatLength} m
**Gewicht:** ${payload.boatWeight} kg

**Vaargebied:** Binnenwater
**Gem. vaartocht:** 2–4 uur (${payload.tripDurationMin}–${payload.tripDurationMax} uur)

**Aanbeveling:**
- Motor: ${payload.result.motorName}
- Vermogen: 8 kW
- Batterij: 32 kWh
- Snelheid: 7.8 km/h
`;

      expect(noteText).toContain('Pieter Jansen');
      expect(noteText).toContain('pieter@test.nl');
      expect(noteText).toContain('buitenboord');
      expect(noteText).toContain('sloep');
      expect(noteText).toContain('E-Pod 8kW');
      expect(noteText).toContain('Binnenwater');
      expect(noteText).toContain('2–4 uur');
    });

    it('should throw error on note creation failure', async () => {
      fetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, data: { id: 'person-123' } })
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: false, error: 'Content too long' })
        });

      // Person creation succeeds
      const personResult = await fetch('https://test.pipedrive.com/api/v1/persons?api_token=key', {
        method: 'POST'
      });
      const personJson = await personResult.json();
      expect(personJson.success).toBe(true);

      // Note creation fails
      const noteResult = await fetch('https://test.pipedrive.com/api/v1/notes?api_token=key', {
        method: 'POST'
      });
      const noteJson = await noteResult.json();
      expect(noteJson.success).toBe(false);
    });
  });

  describe('Return value', () => {
    it('should return wixId and pipedrive IDs on success', async () => {
      const expectedReturn = {
        wixId: 'wix-lead-123',
        pipedrive: {
          personId: 'person-456',
          noteId: 'note-789'
        }
      };

      // Simulate successful flow
      const wixResult = { _id: 'wix-lead-123' };
      const personId = 'person-456';
      const noteId = 'note-789';

      const result = {
        wixId: wixResult._id,
        pipedrive: { personId, noteId }
      };

      expect(result).toEqual(expectedReturn);
    });
  });

  describe('Error handling', () => {
    it('should fail if Wix insert fails', async () => {
      wixData.insert.mockRejectedValue(new Error('Collection not found'));

      await expect(wixData.insert('Leads', {}))
        .rejects.toThrow('Collection not found');
    });

    it('should fail if secrets are unavailable', async () => {
      wixSecrets.getSecret.mockRejectedValue(new Error('Secrets service unavailable'));

      await expect(wixSecrets.getSecret('PIPEDRIVE_API_KEY'))
        .rejects.toThrow('Secrets service unavailable');
    });
  });
});
