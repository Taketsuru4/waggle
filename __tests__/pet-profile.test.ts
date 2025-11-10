import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPet, updatePet, deletePet } from "@/app/dashboard/pets/actions";
import { createMockSupabaseClient } from "./utils/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Pet Profile", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
  });

  describe("createPet", () => {
    it("should successfully create a pet with all data", async () => {
      const formData = new FormData();
      formData.append("name", "Max");
      formData.append("type", "dog");
      formData.append("breed", "Golden Retriever");
      formData.append("age", "3");
      formData.append("weight", "30.5");
      formData.append("description", "Friendly and playful");
      formData.append("special_needs", "Needs medication twice daily");

      const mockUser = { id: "owner-123", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "pet-123" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createPet(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith({
        owner_id: "owner-123",
        name: "Max",
        type: "dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 30.5,
        description: "Friendly and playful",
        special_needs: "Needs medication twice daily",
      });
    });

    it("should successfully create a pet without optional fields", async () => {
      const formData = new FormData();
      formData.append("name", "Luna");
      formData.append("type", "cat");
      formData.append("breed", "Persian");
      formData.append("description", "Calm cat");
      formData.append("special_needs", "None");

      const mockUser = { id: "owner-456", email: "owner2@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "pet-456" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createPet(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Luna",
          type: "cat",
          age: null,
          weight: null,
        }),
      );
    });

    it("should return error when user is not authenticated", async () => {
      const formData = new FormData();
      formData.append("name", "Buddy");
      formData.append("type", "dog");

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await createPet(formData);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when pet creation fails", async () => {
      const formData = new FormData();
      formData.append("name", "Rocky");
      formData.append("type", "dog");
      formData.append("breed", "Bulldog");
      formData.append("description", "Strong dog");
      formData.append("special_needs", "None");

      const mockUser = { id: "owner-789", email: "owner3@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      const result = await createPet(formData);

      expect(result).toEqual({ error: "Database error" });
    });

    it("should correctly parse numeric fields", async () => {
      const formData = new FormData();
      formData.append("name", "Charlie");
      formData.append("type", "bird");
      formData.append("breed", "Parrot");
      formData.append("age", "2");
      formData.append("weight", "0.5");
      formData.append("description", "Colorful parrot");
      formData.append("special_needs", "Requires daily interaction");

      const mockUser = { id: "owner-bird", email: "bird@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "pet-bird" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createPet(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          age: 2,
          weight: 0.5,
        }),
      );
    });
  });

  describe("updatePet", () => {
    it("should successfully update a pet with authorization check", async () => {
      const petId = "pet-123";
      const formData = new FormData();
      formData.append("name", "Max Updated");
      formData.append("type", "dog");
      formData.append("breed", "Golden Retriever");
      formData.append("age", "4");
      formData.append("weight", "32.0");
      formData.append("description", "Very friendly");
      formData.append("special_needs", "Updated medication schedule");

      const mockUser = { id: "owner-123", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq1 = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      try {
        await updatePet(petId, formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockUpdate).toHaveBeenCalledWith({
        name: "Max Updated",
        type: "dog",
        breed: "Golden Retriever",
        age: 4,
        weight: 32.0,
        description: "Very friendly",
        special_needs: "Updated medication schedule",
      });
    });

    it("should enforce owner authorization on update", async () => {
      const petId = "pet-456";
      const formData = new FormData();
      formData.append("name", "Unauthorized Update");
      formData.append("type", "cat");
      formData.append("breed", "Persian");
      formData.append("description", "Test");
      formData.append("special_needs", "None");

      const mockUser = { id: "correct-owner-id", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq2 = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      try {
        await updatePet(petId, formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      // Verify both eq calls are made (id and owner_id)
      expect(mockEq1).toHaveBeenCalledWith("id", petId);
      expect(mockEq2).toHaveBeenCalledWith("owner_id", "correct-owner-id");
    });

    it("should return error when user is not authenticated", async () => {
      const petId = "pet-123";
      const formData = new FormData();

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await updatePet(petId, formData);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when update fails", async () => {
      const petId = "pet-789";
      const formData = new FormData();
      formData.append("name", "Test");
      formData.append("type", "dog");
      formData.append("breed", "Test");
      formData.append("description", "Test");
      formData.append("special_needs", "None");

      const mockUser = { id: "owner-789", email: "test@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Update failed" },
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      const result = await updatePet(petId, formData);

      expect(result).toEqual({ error: "Update failed" });
    });

    it("should handle null values for optional fields", async () => {
      const petId = "pet-null";
      const formData = new FormData();
      formData.append("name", "Fluffy");
      formData.append("type", "rabbit");
      formData.append("breed", "Dutch");
      formData.append("description", "Small rabbit");
      formData.append("special_needs", "None");
      // age and weight not provided

      const mockUser = { id: "owner-null", email: "null@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      try {
        await updatePet(petId, formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          age: null,
          weight: null,
        }),
      );
    });
  });

  describe("deletePet", () => {
    it("should successfully delete a pet with authorization check", async () => {
      const petId = "pet-delete-123";
      const mockUser = { id: "owner-delete", email: "delete@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq2 = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ delete: mockDelete } as any);

      const result = await deletePet(petId);

      expect(result).toEqual({ success: true });
      expect(mockEq1).toHaveBeenCalledWith("id", petId);
      expect(mockEq2).toHaveBeenCalledWith("owner_id", "owner-delete");
    });

    it("should enforce owner authorization on delete", async () => {
      const petId = "pet-auth-delete";
      const mockUser = {
        id: "authorized-owner-id",
        email: "authorized@example.com",
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq2 = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ delete: mockDelete } as any);

      await deletePet(petId);

      // Verify owner_id filter is applied
      expect(mockEq2).toHaveBeenCalledWith("owner_id", "authorized-owner-id");
    });

    it("should return error when user is not authenticated", async () => {
      const petId = "pet-unauth";

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await deletePet(petId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when delete fails", async () => {
      const petId = "pet-fail-delete";
      const mockUser = { id: "owner-fail", email: "fail@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Delete failed" },
        }),
      });

      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ delete: mockDelete } as any);

      const result = await deletePet(petId);

      expect(result).toEqual({ error: "Delete failed" });
    });

    it("should prevent deletion of pet not owned by user", async () => {
      const petId = "pet-not-owned";
      const mockUser = {
        id: "different-owner",
        email: "different@example.com",
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq2 = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: "Not found" } });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ delete: mockDelete } as any);

      const result = await deletePet(petId);

      expect(result).toEqual({ error: "Not found" });
    });
  });
});
