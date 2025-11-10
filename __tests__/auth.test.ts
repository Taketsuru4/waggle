import { describe, it, expect, vi, beforeEach } from "vitest";
import { signUp, signIn } from "@/app/auth/actions";
import { createMockSupabaseClient } from "./utils/supabase-mock";

// Mock the Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Authentication", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
  });

  describe("signUp", () => {
    it("should successfully sign up a new user with owner role", async () => {
      const formData = new FormData();
      formData.append("email", "owner@example.com");
      formData.append("password", "password123");
      formData.append("full_name", "John Doe");
      formData.append("role", "owner");

      const mockUser = {
        id: "user-123",
        email: "owner@example.com",
        user_metadata: { full_name: "John Doe", role: "owner" },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: "token" },
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as any);

      try {
        await signUp(formData);
      } catch (error: any) {
        // Expect redirect error
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: "owner@example.com",
        password: "password123",
        options: {
          data: {
            full_name: "John Doe",
            role: "owner",
          },
        },
      });
    });

    it("should successfully sign up a new user with caregiver role", async () => {
      const formData = new FormData();
      formData.append("email", "caregiver@example.com");
      formData.append("password", "password123");
      formData.append("full_name", "Jane Smith");
      formData.append("role", "caregiver");

      const mockUser = {
        id: "user-456",
        email: "caregiver@example.com",
        user_metadata: { full_name: "Jane Smith", role: "caregiver" },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: "token" },
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as any);

      try {
        await signUp(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "caregiver@example.com",
          options: expect.objectContaining({
            data: expect.objectContaining({
              role: "caregiver",
            }),
          }),
        }),
      );
    });

    it("should successfully sign up a new user with both roles", async () => {
      const formData = new FormData();
      formData.append("email", "both@example.com");
      formData.append("password", "password123");
      formData.append("full_name", "Bob Johnson");
      formData.append("role", "both");

      const mockUser = {
        id: "user-789",
        email: "both@example.com",
        user_metadata: { full_name: "Bob Johnson", role: "both" },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: "token" },
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as any);

      try {
        await signUp(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            data: expect.objectContaining({
              role: "both",
            }),
          }),
        }),
      );
    });

    it("should return error when signup fails", async () => {
      const formData = new FormData();
      formData.append("email", "invalid@example.com");
      formData.append("password", "pass");
      formData.append("full_name", "Test User");
      formData.append("role", "owner");

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Password too short" } as any,
      });

      const result = await signUp(formData);

      expect(result).toEqual({ error: "Password too short" });
    });

    it("should require email confirmation when session is not created", async () => {
      const formData = new FormData();
      formData.append("email", "confirm@example.com");
      formData.append("password", "password123");
      formData.append("full_name", "Confirm User");
      formData.append("role", "owner");

      const mockUser = {
        id: "user-confirm",
        email: "confirm@example.com",
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: null, // No session means email confirmation required
        },
        error: null,
      });

      const result = await signUp(formData);

      expect(result).toEqual({
        error:
          "Επιβεβαίωση email απαιτείται. Έλεγξε το email σου για το link επιβεβαίωσης.",
      });
    });

    it("should persist role to profiles table after signup", async () => {
      const formData = new FormData();
      formData.append("email", "owner@example.com");
      formData.append("password", "password123");
      formData.append("full_name", "John Doe");
      formData.append("role", "owner");

      const mockUser = {
        id: "user-123",
        email: "owner@example.com",
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: "token" },
        },
        error: null,
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      } as any);

      try {
        await signUp(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
      expect(mockUpdate).toHaveBeenCalledWith({ role: "owner" });
    });
  });

  describe("signIn", () => {
    it("should successfully sign in an existing user", async () => {
      const formData = new FormData();
      formData.append("email", "user@example.com");
      formData.append("password", "password123");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: "user-123", email: "user@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      });

      try {
        await signIn(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });

    it("should return error when credentials are invalid", async () => {
      const formData = new FormData();
      formData.append("email", "wrong@example.com");
      formData.append("password", "wrongpass");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" } as any,
      });

      const result = await signIn(formData);

      expect(result).toEqual({ error: "Invalid login credentials" });
    });

    it("should return error when email does not exist", async () => {
      const formData = new FormData();
      formData.append("email", "nonexistent@example.com");
      formData.append("password", "password123");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" } as any,
      });

      const result = await signIn(formData);

      expect(result).toEqual({ error: "Invalid login credentials" });
    });
  });
});
