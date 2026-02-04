/**
 * Mock for wix-secrets-backend module
 * Used in tests to simulate secret retrieval
 */

const mockSecrets = {
  'PIPEDRIVE_API_KEY': 'mock-api-key-12345',
  'PIPEDRIVE_COMPANY_DOMAIN': 'greenmarine'
};

const getSecret = jest.fn().mockImplementation((secretName) => {
  return Promise.resolve(mockSecrets[secretName] || null);
});

// Helper functions for test setup
const __resetMocks = () => {
  getSecret.mockClear();
};

const __setSecret = (name, value) => {
  mockSecrets[name] = value;
};

const __setSecretError = (secretName) => {
  getSecret.mockImplementationOnce((name) => {
    if (name === secretName) {
      return Promise.reject(new Error(`Secret '${secretName}' not found`));
    }
    return Promise.resolve(mockSecrets[name]);
  });
};

const __setSecretMissing = (secretName) => {
  getSecret.mockImplementationOnce((name) => {
    if (name === secretName) {
      return Promise.resolve(null);
    }
    return Promise.resolve(mockSecrets[name]);
  });
};

module.exports = {
  getSecret,
  __resetMocks,
  __setSecret,
  __setSecretError,
  __setSecretMissing
};
