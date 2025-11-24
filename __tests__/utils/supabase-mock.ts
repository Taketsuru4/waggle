import { vi } from "vitest";

export const createMockSupabaseClient = () => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockIlike = vi.fn();
  const mockOr = vi.fn();
  const mockGte = vi.fn();
  const mockLte = vi.fn();
  const mockOrder = vi.fn();
  const mockSingle = vi.fn();

  // Chain methods - create a recursive chain that always returns itself
  const createChain = (finalResult: any = { data: null, error: null }): any => {
    const chain: any = {
      select: vi.fn((columns?: string) => chain),
      insert: vi.fn((values: any) => chain),
      update: vi.fn((values: any) => chain),
      delete: vi.fn(() => chain),
      eq: vi.fn((column: string, value: any) => chain),
      ilike: vi.fn((column: string, pattern: string) => chain),
      or: vi.fn((filters: string) => chain),
      gte: vi.fn((column: string, value: any) => chain),
      lte: vi.fn((column: string, value: any) => chain),
      order: vi.fn((column: string, options?: any) => chain),
      single: vi.fn(() => Promise.resolve(finalResult)),
      then: (resolve: any) => Promise.resolve(finalResult).then(resolve),
      catch: (reject: any) => Promise.resolve(finalResult).catch(reject),
    };
    
    // Make the chain thenable so it can be awaited directly
    chain.data = finalResult.data;
    chain.error = finalResult.error;
    
    return chain;
  };

  return {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
    from: mockFrom.mockImplementation((table: string) => {
      const result = { data: null, error: null };
      return createChain(result);
    }),
    // Expose mocks for assertions
    mocks: {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      ilike: mockIlike,
      or: mockOr,
      gte: mockGte,
      lte: mockLte,
      order: mockOrder,
      single: mockSingle,
    },
  };
};

export const mockSupabaseClient = createMockSupabaseClient();
