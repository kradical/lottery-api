// mock fetch globally for tests
// individual suites can mock return values to their needs
export const mockFetchJson = jest.fn();

jest.mock("node-fetch", (): object => ({
  __esModule: true,
  default: (): object => ({
    json: mockFetchJson
  })
}));
