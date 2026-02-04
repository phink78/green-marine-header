/**
 * Mock for wix-data module
 * Used in tests to simulate Wix CMS operations
 */

const mockInsertResult = {
  _id: 'mock-lead-id-123',
  _createdDate: new Date(),
  _updatedDate: new Date()
};

const wixData = {
  insert: jest.fn().mockResolvedValue(mockInsertResult),
  query: jest.fn().mockReturnValue({
    eq: jest.fn().mockReturnThis(),
    find: jest.fn().mockResolvedValue({ items: [], totalCount: 0 })
  }),
  get: jest.fn().mockResolvedValue(null),
  update: jest.fn().mockResolvedValue(mockInsertResult),
  remove: jest.fn().mockResolvedValue(mockInsertResult),

  // Helper to reset all mocks
  __resetMocks: () => {
    wixData.insert.mockClear();
    wixData.query.mockClear();
    wixData.get.mockClear();
    wixData.update.mockClear();
    wixData.remove.mockClear();
  },

  // Helper to set insert result
  __setInsertResult: (result) => {
    wixData.insert.mockResolvedValue(result);
  },

  // Helper to simulate insert failure
  __setInsertError: (error) => {
    wixData.insert.mockRejectedValue(error);
  }
};

module.exports = wixData;
