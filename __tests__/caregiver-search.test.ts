import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchCaregivers } from "@/lib/data/caregivers";
import { createMockSupabaseClient } from "./utils/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Caregiver Search and Filter", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
  });

  const mockCaregivers = [
    {
      id: "cg-1",
      user_id: "user-1",
      city: "Athens",
      hourly_rate: 20,
      accepts_dogs: true,
      accepts_cats: false,
      accepts_birds: false,
      accepts_rabbits: false,
      accepts_other: false,
      available: true,
      profiles: { full_name: "John Doe", email: "john@example.com" },
    },
    {
      id: "cg-2",
      user_id: "user-2",
      city: "Thessaloniki",
      hourly_rate: 25,
      accepts_dogs: false,
      accepts_cats: true,
      accepts_birds: false,
      accepts_rabbits: false,
      accepts_other: false,
      available: true,
      profiles: { full_name: "Jane Smith", email: "jane@example.com" },
    },
  ];

  describe("Basic Search", () => {
    it("should return all available caregivers with no filters", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({});

      expect(result).toEqual(mockCaregivers);
      expect(mockEq).toHaveBeenCalledWith("available", true);
    });

    it("should filter by availability when onlyAvailable is true", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ onlyAvailable: true });

      expect(result).toEqual(mockCaregivers);
      expect(mockEq).toHaveBeenCalledWith("available", true);
    });

    it("should include unavailable caregivers when onlyAvailable is false", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [...mockCaregivers, { ...mockCaregivers[0], available: false }],
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ onlyAvailable: false });

      expect(result.length).toBeGreaterThan(mockCaregivers.length);
    });
  });

  describe("City Filter", () => {
    it("should filter caregivers by exact city name", async () => {
      const athensCaregiver = [mockCaregivers[0]];

      const mockOrder = vi.fn().mockResolvedValue({
        data: athensCaregiver,
        error: null,
      });

      const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ ilike: mockIlike });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ city: "Athens" });

      expect(result).toEqual(athensCaregiver);
      expect(mockIlike).toHaveBeenCalledWith("city", "%Athens%");
    });

    it("should filter caregivers by partial city name match", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ ilike: mockIlike });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ city: "Athen" });

      expect(mockIlike).toHaveBeenCalledWith("city", "%Athen%");
    });

    it("should be case-insensitive when filtering by city", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockCaregivers[0]],
        error: null,
      });

      const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ ilike: mockIlike });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await searchCaregivers({ city: "athens" });

      expect(mockIlike).toHaveBeenCalledWith("city", "%athens%");
    });
  });

  describe("Pet Type Filter", () => {
    it("should filter caregivers who accept dogs", async () => {
      const dogCaregivers = [mockCaregivers[0]];

      const mockOrder = vi.fn().mockResolvedValue({
        data: dogCaregivers,
        error: null,
      });

      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ petType: "dog" });

      expect(result).toEqual(dogCaregivers);
      expect(mockEq2).toHaveBeenCalledWith("accepts_dogs", true);
    });

    it("should filter caregivers who accept cats", async () => {
      const catCaregivers = [mockCaregivers[1]];

      const mockOrder = vi.fn().mockResolvedValue({
        data: catCaregivers,
        error: null,
      });

      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ petType: "cat" });

      expect(result).toEqual(catCaregivers);
      expect(mockEq2).toHaveBeenCalledWith("accepts_cats", true);
    });

    it("should filter caregivers who accept birds", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ petType: "bird" });

      expect(mockEq2).toHaveBeenCalledWith("accepts_birds", true);
    });

    it("should filter caregivers who accept rabbits", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ petType: "rabbit" });

      expect(mockEq2).toHaveBeenCalledWith("accepts_rabbits", true);
    });

    it("should filter caregivers who accept other pets", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ petType: "other" });

      expect(mockEq2).toHaveBeenCalledWith("accepts_other", true);
    });
  });

  describe("Price Range Filter", () => {
    it("should filter caregivers by minimum hourly rate", async () => {
      const filteredCaregivers = [mockCaregivers[1]]; // Only 25/hour

      const mockOrder = vi.fn().mockResolvedValue({
        data: filteredCaregivers,
        error: null,
      });

      const mockGte = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ minRate: 25 });

      expect(result).toEqual(filteredCaregivers);
      expect(mockGte).toHaveBeenCalledWith("hourly_rate", 25);
    });

    it("should filter caregivers by maximum hourly rate", async () => {
      const filteredCaregivers = [mockCaregivers[0]]; // Only 20/hour

      const mockOrder = vi.fn().mockResolvedValue({
        data: filteredCaregivers,
        error: null,
      });

      const mockLte = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ lte: mockLte });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ maxRate: 20 });

      expect(result).toEqual(filteredCaregivers);
      expect(mockLte).toHaveBeenCalledWith("hourly_rate", 20);
    });

    it("should filter caregivers by price range (min and max)", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockLte = vi.fn().mockReturnValue({ order: mockOrder });
      const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
      const mockEq = vi.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ minRate: 15, maxRate: 30 });

      expect(result).toEqual(mockCaregivers);
      expect(mockGte).toHaveBeenCalledWith("hourly_rate", 15);
      expect(mockLte).toHaveBeenCalledWith("hourly_rate", 30);
    });

    it("should handle zero as minimum rate", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockGte = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await searchCaregivers({ minRate: 0 });

      expect(mockGte).toHaveBeenCalledWith("hourly_rate", 0);
    });
  });

  describe("Text Search", () => {
    it("should search caregivers by text in city or bio", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockOr = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ or: mockOr });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ search: "Athens" });

      expect(mockOr).toHaveBeenCalledWith(
        "city.ilike.%Athens%,bio.ilike.%Athens%",
      );
    });

    it("should handle special search terms", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const mockOr = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ or: mockOr });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await searchCaregivers({ search: "experienced" });

      expect(mockOr).toHaveBeenCalledWith(
        "city.ilike.%experienced%,bio.ilike.%experienced%",
      );
    });
  });

  describe("Combined Filters", () => {
    it("should apply multiple filters simultaneously", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockCaregivers[0]],
        error: null,
      });

      // Create a query mock that returns itself for all chainable methods
      const queryMock: any = {
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: mockOrder,
      };

      // Make all chainable methods return the same object
      queryMock.eq.mockReturnValue(queryMock);
      queryMock.ilike.mockReturnValue(queryMock);
      queryMock.gte.mockReturnValue(queryMock);
      queryMock.lte.mockReturnValue(queryMock);

      const mockSelect = vi.fn().mockReturnValue(queryMock);
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({
        city: "Athens",
        petType: "dog",
        minRate: 15,
        maxRate: 25,
      });

      expect(queryMock.eq).toHaveBeenCalledWith("available", true);
      expect(queryMock.ilike).toHaveBeenCalledWith("city", "%Athens%");
      expect(queryMock.eq).toHaveBeenCalledWith("accepts_dogs", true);
      expect(queryMock.gte).toHaveBeenCalledWith("hourly_rate", 15);
      expect(queryMock.lte).toHaveBeenCalledWith("hourly_rate", 25);
      expect(result).toEqual([mockCaregivers[0]]);
    });

    it("should combine city, pet type, and text search", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockIlike = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockOr = vi.fn().mockReturnValue({ ilike: mockIlike });
      const mockEq1 = vi.fn().mockReturnValue({ or: mockOr });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await searchCaregivers({
        search: "friendly",
        city: "Thessaloniki",
        petType: "cat",
      });

      expect(mockOr).toHaveBeenCalledWith(
        "city.ilike.%friendly%,bio.ilike.%friendly%",
      );
      expect(mockIlike).toHaveBeenCalledWith("city", "%Thessaloniki%");
      expect(mockEq2).toHaveBeenCalledWith("accepts_cats", true);
    });
  });

  describe("Error Handling", () => {
    it("should return empty array when search fails", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({});

      expect(result).toEqual([]);
    });

    it("should handle null data in response", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({});

      expect(result).toEqual([]);
    });
  });

  describe("Results Ordering", () => {
    it("should order results by created_at descending", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await searchCaregivers({});

      expect(mockOrder).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string search", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({ search: "" });

      // Empty search should not apply or filter
      expect(result).toEqual(mockCaregivers);
    });

    it("should handle undefined values in filters", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({
        search: undefined,
        city: undefined,
        petType: undefined,
        minRate: undefined,
        maxRate: undefined,
      });

      expect(result).toEqual(mockCaregivers);
    });

    it("should return caregivers with complete profile data", async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockCaregivers,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await searchCaregivers({});

      // Verify that profiles are included in results
      expect(result[0].profiles).toBeDefined();
      expect(result[0].profiles.full_name).toBe("John Doe");
    });
  });
});
