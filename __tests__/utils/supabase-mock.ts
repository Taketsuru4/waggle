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

  // Chain methods
  const createChain = (finalResult: any) => {
    const chain = {
      select: mockSelect.mockReturnValue(chain),
      insert: mockInsert.mockReturnValue(chain),
      update: mockUpdate.mockReturnValue(chain),
      delete: mockDelete.mockReturnValue(chain),
      eq: mockEq.mockReturnValue(chain),
      ilike: mockIlike.mockReturnValue(chain),
      or: mockOr.mockReturnValue(chain),
      gte: mockGte.mockReturnValue(chain),
      lte: mockLte.mockReturnValue(chain),
      order: mockOrder.mockReturnValue(finalResult),
      single: mockSingle.mockReturnValue(finalResult),
    };
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
