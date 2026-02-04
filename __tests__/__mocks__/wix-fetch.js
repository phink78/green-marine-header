/**
 * Mock for wix-fetch module
 * Used in tests to simulate HTTP requests to external APIs (Pipedrive)
 */

let mockResponses = {};

const createMockResponse = (data, ok = true) => ({
  ok,
  status: ok ? 200 : 400,
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data))
});

const fetch = jest.fn().mockImplementation((url) => {
  // Check for specific URL patterns
  if (url.includes('/persons')) {
    return Promise.resolve(createMockResponse({
      success: true,
      data: { id: 'mock-person-id-456' }
    }));
  }

  if (url.includes('/notes')) {
    return Promise.resolve(createMockResponse({
      success: true,
      data: { id: 'mock-note-id-789' }
    }));
  }

  if (url.includes('/deals')) {
    return Promise.resolve(createMockResponse({
      success: true,
      data: { id: 'mock-deal-id-101' }
    }));
  }

  // Default response
  return Promise.resolve(createMockResponse({ success: true, data: {} }));
});

// Helper functions for test setup
fetch.__resetMocks = () => {
  fetch.mockClear();
  mockResponses = {};
};

fetch.__setResponse = (urlPattern, response, ok = true) => {
  mockResponses[urlPattern] = { response, ok };
};

fetch.__setPersonError = () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve(createMockResponse({ success: false, error: 'Person creation failed' }, false))
  );
};

fetch.__setNoteError = () => {
  // First call succeeds (person), second fails (note)
  fetch
    .mockImplementationOnce(() => Promise.resolve(createMockResponse({
      success: true,
      data: { id: 'mock-person-id-456' }
    })))
    .mockImplementationOnce(() => Promise.resolve(createMockResponse({
      success: false,
      error: 'Note creation failed'
    }, false)));
};

fetch.__setDealError = () => {
  // Person succeeds, deal fails
  fetch
    .mockImplementationOnce(() => Promise.resolve(createMockResponse({
      success: true,
      data: { id: 'mock-person-id-456' }
    })))
    .mockImplementationOnce(() => Promise.resolve(createMockResponse({
      success: false,
      error: 'Deal creation failed'
    }, false)));
};

module.exports = { fetch };
