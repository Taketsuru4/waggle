import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCaregiverProfile,
  updateCaregiverProfile,
} from "@/app/dashboard/caregiver/actions";
import { createMockSupabaseClient } from "./utils/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Caregiver Profile", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
  });

  describe("createCaregiverProfile", () => {
    it("should successfully create a caregiver profile with all data", async () => {
      const formData = new FormData();
      formData.append("bio", "Experienced pet caregiver");
      formData.append("experience_years", "5");
      formData.append("hourly_rate", "25.50");
      formData.append("city", "Athens");
      formData.append("address", "123 Main St");
      formData.append("postal_code", "12345");
      formData.append("accepts_dogs", "on");
      formData.append("accepts_cats", "on");

      const mockUser = { id: "user-123", email: "caregiver@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "caregiver-123" },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "owner" },
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "caregiver_profiles") {
          return { insert: mockInsert } as any;
        }
        if (table === "profiles") {
          return { select: mockSelect, update: mockUpdate } as any;
        }
        return {} as any;
      });

      try {
        await createCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: "user-123",
        bio: "Experienced pet caregiver",
        experience_years: 5,
        hourly_rate: 25.5,
        city: "Athens",
        address: "123 Main St",
        postal_code: "12345",
        accepts_dogs: true,
        accepts_cats: true,
        accepts_birds: false,
        accepts_rabbits: false,
        accepts_other: false,
        available: true,
        contact_phone: null,
        whatsapp: null,
        viber: null,
      });
    });

    it("should update user role to 'both' when creating caregiver profile for owner", async () => {
      const formData = new FormData();
      formData.append("bio", "Love pets");
      formData.append("experience_years", "3");
      formData.append("city", "Thessaloniki");
      formData.append("address", "456 Oak Ave");
      formData.append("postal_code", "54321");

      const mockUser = { id: "user-456", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({ data: {}, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "owner" },
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "caregiver_profiles") {
          return { insert: mockInsert } as any;
        }
        if (table === "profiles") {
          return { select: mockSelect, update: mockUpdate } as any;
        }
        return {} as any;
      });

      try {
        await createCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockUpdate).toHaveBeenCalledWith({ role: "both" });
    });

    it("should set role to 'caregiver' when user has no existing role", async () => {
      const formData = new FormData();
      formData.append("bio", "New caregiver");
      formData.append("experience_years", "1");
      formData.append("city", "Patras");
      formData.append("address", "789 Elm St");
      formData.append("postal_code", "26221");

      const mockUser = { id: "user-789", email: "new@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({ data: {}, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: null },
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "caregiver_profiles") {
          return { insert: mockInsert } as any;
        }
        if (table === "profiles") {
          return { select: mockSelect, update: mockUpdate } as any;
        }
        return {} as any;
      });

      try {
        await createCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockUpdate).toHaveBeenCalledWith({ role: "caregiver" });
    });

    it("should return error when user is not authenticated", async () => {
      const formData = new FormData();

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await createCaregiverProfile(formData);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when profile creation fails", async () => {
      const formData = new FormData();
      formData.append("bio", "Test");
      formData.append("experience_years", "2");
      formData.append("city", "Athens");
      formData.append("address", "Test St");
      formData.append("postal_code", "12345");

      const mockUser = { id: "user-123", email: "test@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Duplicate profile" },
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      const result = await createCaregiverProfile(formData);

      expect(result).toEqual({ error: "Duplicate profile" });
    });

    it("should correctly parse all pet type acceptances", async () => {
      const formData = new FormData();
      formData.append("bio", "All pets welcome");
      formData.append("experience_years", "10");
      formData.append("city", "Athens");
      formData.append("address", "Pet St");
      formData.append("postal_code", "11111");
      formData.append("accepts_dogs", "on");
      formData.append("accepts_cats", "on");
      formData.append("accepts_birds", "on");
      formData.append("accepts_rabbits", "on");
      formData.append("accepts_other", "on");

      const mockUser = { id: "user-all", email: "all@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({ data: {}, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "owner" },
            error: null,
          }),
        }),
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "caregiver_profiles") {
          return { insert: mockInsert } as any;
        }
        if (table === "profiles") {
          return { select: mockSelect, update: mockUpdate } as any;
        }
        return {} as any;
      });

      try {
        await createCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          accepts_dogs: true,
          accepts_cats: true,
          accepts_birds: true,
          accepts_rabbits: true,
          accepts_other: true,
        }),
      );
    });
  });

  describe("updateCaregiverProfile", () => {
    it("should successfully update caregiver profile", async () => {
      const formData = new FormData();
      formData.append("bio", "Updated bio");
      formData.append("experience_years", "7");
      formData.append("hourly_rate", "30");
      formData.append("city", "Athens");
      formData.append("address", "Updated Address");
      formData.append("postal_code", "99999");
      formData.append("accepts_dogs", "on");
      formData.append("available", "on");

      const mockUser = { id: "user-123", email: "caregiver@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      try {
        await updateCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockUpdate).toHaveBeenCalledWith({
        bio: "Updated bio",
        experience_years: 7,
        hourly_rate: 30,
        city: "Athens",
        address: "Updated Address",
        postal_code: "99999",
        accepts_dogs: true,
        accepts_cats: false,
        accepts_birds: false,
        accepts_rabbits: false,
        accepts_other: false,
        available: true,
        contact_phone: null,
        whatsapp: null,
        viber: null,
      });
    });

    it("should set availability to false when unchecked", async () => {
      const formData = new FormData();
      formData.append("bio", "Not available now");
      formData.append("experience_years", "5");
      formData.append("city", "Thessaloniki");
      formData.append("address", "Test St");
      formData.append("postal_code", "54321");
      // available checkbox not checked (not in formData)

      const mockUser = { id: "user-456", email: "test@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      try {
        await updateCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          available: false,
        }),
      );
    });

    it("should return error when user is not authenticated", async () => {
      const formData = new FormData();

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await updateCaregiverProfile(formData);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when update fails", async () => {
      const formData = new FormData();
      formData.append("bio", "Test");
      formData.append("experience_years", "3");
      formData.append("city", "Athens");
      formData.append("address", "Test");
      formData.append("postal_code", "12345");

      const mockUser = { id: "user-123", email: "test@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Update failed" },
        }),
      });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      const result = await updateCaregiverProfile(formData);

      expect(result).toEqual({ error: "Update failed" });
    });

    it("should correctly filter by user_id in update", async () => {
      const formData = new FormData();
      formData.append("bio", "Test");
      formData.append("experience_years", "2");
      formData.append("city", "Athens");
      formData.append("address", "Test St");
      formData.append("postal_code", "12345");

      const mockUser = { id: "specific-user-id", email: "user@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      try {
        await updateCaregiverProfile(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockEq).toHaveBeenCalledWith("user_id", "specific-user-id");
    });
  });
});
