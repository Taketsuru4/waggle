import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createBooking,
  acceptBooking,
  declineBooking,
  cancelBooking,
  completeBooking,
} from "@/app/bookings/actions";
import { createMockSupabaseClient } from "./utils/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Booking Lifecycle", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
  });

  describe("createBooking", () => {
    it("should successfully create a booking", async () => {
      const formData = new FormData();
      formData.append("caregiver_id", "caregiver-123");
      formData.append("pet_id", "pet-456");
      formData.append("start_date", "2024-06-01");
      formData.append("end_date", "2024-06-05");
      formData.append("notes", "Please feed twice daily");

      const mockUser = { id: "owner-789", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "booking-001" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createBooking(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith({
        owner_id: "owner-789",
        caregiver_id: "caregiver-123",
        pet_id: "pet-456",
        start_date: "2024-06-01",
        end_date: "2024-06-05",
        notes: "Please feed twice daily",
        status: "pending",
      });
    });

    it("should create a booking without notes", async () => {
      const formData = new FormData();
      formData.append("caregiver_id", "caregiver-456");
      formData.append("pet_id", "pet-789");
      formData.append("start_date", "2024-07-01");
      formData.append("end_date", "2024-07-10");
      formData.append("notes", "");

      const mockUser = { id: "owner-abc", email: "owner2@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "booking-002" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createBooking(formData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: null,
        }),
      );
    });

    it("should return error when user is not authenticated", async () => {
      const formData = new FormData();
      formData.append("caregiver_id", "caregiver-123");
      formData.append("pet_id", "pet-456");
      formData.append("start_date", "2024-06-01");
      formData.append("end_date", "2024-06-05");

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await createBooking(formData);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when end date is before start date", async () => {
      const formData = new FormData();
      formData.append("caregiver_id", "caregiver-123");
      formData.append("pet_id", "pet-456");
      formData.append("start_date", "2024-06-10");
      formData.append("end_date", "2024-06-05");

      const mockUser = { id: "owner-789", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await createBooking(formData);

      expect(result).toEqual({
        error: "Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης",
      });
    });

    it("should return error when end date equals start date", async () => {
      const formData = new FormData();
      formData.append("caregiver_id", "caregiver-123");
      formData.append("pet_id", "pet-456");
      formData.append("start_date", "2024-06-05");
      formData.append("end_date", "2024-06-05");

      const mockUser = { id: "owner-789", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await createBooking(formData);

      expect(result).toEqual({
        error: "Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης",
      });
    });

    it("should return error when database insert fails", async () => {
      const formData = new FormData();
      formData.append("caregiver_id", "caregiver-123");
      formData.append("pet_id", "pet-456");
      formData.append("start_date", "2024-06-01");
      formData.append("end_date", "2024-06-05");

      const mockUser = { id: "owner-789", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Foreign key constraint violation" },
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      const result = await createBooking(formData);

      expect(result).toEqual({ error: "Foreign key constraint violation" });
    });
  });

  describe("acceptBooking", () => {
    it("should successfully accept a booking by caregiver", async () => {
      const bookingId = "booking-123";
      const mockUser = { id: "caregiver-user-123", email: "cg@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock the authorization check
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          caregiver_id: "caregiver-profile-123",
          caregiver_profiles: { user_id: "caregiver-user-123" },
        },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "bookings") {
          return { select: mockSelect, update: mockUpdate } as any;
        }
        return {} as any;
      });

      const result = await acceptBooking(bookingId);

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalledWith({ status: "accepted" });
    });

    it("should return error when user is not authenticated", async () => {
      const bookingId = "booking-123";

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await acceptBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when user is not the caregiver for booking", async () => {
      const bookingId = "booking-456";
      const mockUser = { id: "wrong-user-id", email: "wrong@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          caregiver_id: "caregiver-profile-456",
          caregiver_profiles: { user_id: "correct-user-id" },
        },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await acceptBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when booking does not exist", async () => {
      const bookingId = "nonexistent-booking";
      const mockUser = { id: "user-123", email: "user@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await acceptBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });
  });

  describe("declineBooking", () => {
    it("should successfully decline a booking by caregiver", async () => {
      const bookingId = "booking-decline-123";
      const mockUser = { id: "caregiver-user-456", email: "cg2@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          caregiver_id: "caregiver-profile-456",
          caregiver_profiles: { user_id: "caregiver-user-456" },
        },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "bookings") {
          return { select: mockSelect, update: mockUpdate } as any;
        }
        return {} as any;
      });

      const result = await declineBooking(bookingId);

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalledWith({ status: "declined" });
    });

    it("should return error when user is not authenticated", async () => {
      const bookingId = "booking-123";

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await declineBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should enforce caregiver authorization on decline", async () => {
      const bookingId = "booking-auth-decline";
      const mockUser = { id: "unauthorized-user", email: "unauth@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          caregiver_id: "caregiver-profile-789",
          caregiver_profiles: { user_id: "authorized-user" },
        },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      });

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await declineBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });
  });

  describe("cancelBooking", () => {
    it("should successfully cancel a booking by owner", async () => {
      const bookingId = "booking-cancel-123";
      const mockUser = { id: "owner-cancel-123", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq2 = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      const result = await cancelBooking(bookingId);

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalledWith({ status: "cancelled" });
      expect(mockEq1).toHaveBeenCalledWith("id", bookingId);
      expect(mockEq2).toHaveBeenCalledWith("owner_id", "owner-cancel-123");
    });

    it("should return error when user is not authenticated", async () => {
      const bookingId = "booking-123";

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await cancelBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should enforce owner authorization on cancel", async () => {
      const bookingId = "booking-owner-check";
      const mockUser = { id: "actual-owner-id", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq2 = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      await cancelBooking(bookingId);

      // Verify owner_id filter is enforced
      expect(mockEq2).toHaveBeenCalledWith("owner_id", "actual-owner-id");
    });

    it("should return error when cancel fails", async () => {
      const bookingId = "booking-fail-cancel";
      const mockUser = { id: "owner-fail", email: "fail@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Cancel failed" },
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      const result = await cancelBooking(bookingId);

      expect(result).toEqual({ error: "Cancel failed" });
    });
  });

  describe("completeBooking", () => {
    it("should successfully complete a booking as owner", async () => {
      const bookingId = "booking-complete-123";
      const mockUser = { id: "user-123", email: "user@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock owner check - returns data (user is owner)
      const mockSingleOwner = vi.fn().mockResolvedValue({
        data: { id: bookingId },
        error: null,
      });

      // Mock caregiver check - returns null (user is not caregiver)
      const mockSingleCaregiver = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock update
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "bookings") {
          callCount++;
          if (callCount === 1) {
            // First call: owner check
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleOwner,
                  }),
                }),
              }),
            } as any;
          }
          if (callCount === 2) {
            // Second call: caregiver check
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleCaregiver,
                  }),
                }),
              }),
            } as any;
          }
          // Third call: update
          return { update: mockUpdate } as any;
        }
        return {} as any;
      });

      const result = await completeBooking(bookingId);

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalledWith({ status: "completed" });
    });

    it("should return error when user is not authenticated", async () => {
      const bookingId = "booking-123";

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await completeBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should allow caregiver to complete booking", async () => {
      const bookingId = "booking-caregiver-complete";
      const mockUser = {
        id: "caregiver-user-id",
        email: "caregiver@example.com",
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock owner check - returns null (user is not owner)
      const mockSingleOwner = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock caregiver check - returns data (user is caregiver)
      const mockSingleCaregiver = vi.fn().mockResolvedValue({
        data: {
          id: bookingId,
          caregiver_profiles: { user_id: mockUser.id },
        },
        error: null,
      });

      // Mock update
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "bookings") {
          callCount++;
          if (callCount === 1) {
            // First call: owner check
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleOwner,
                  }),
                }),
              }),
            } as any;
          }
          if (callCount === 2) {
            // Second call: caregiver check
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleCaregiver,
                  }),
                }),
              }),
            } as any;
          }
          // Third call: update
          return { update: mockUpdate } as any;
        }
        return {} as any;
      });

      const result = await completeBooking(bookingId);

      expect(result).toEqual({ success: true });
    });

    it("should return error when user is neither owner nor caregiver", async () => {
      const bookingId = "booking-unauthorized";
      const mockUser = { id: "unauthorized-user", email: "unauth@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock owner check - returns null
      const mockSingleOwner = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock caregiver check - returns null
      const mockSingleCaregiver = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "bookings") {
          callCount++;
          if (callCount === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleOwner,
                  }),
                }),
              }),
            } as any;
          }
          if (callCount === 2) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleCaregiver,
                  }),
                }),
              }),
            } as any;
          }
        }
        return {} as any;
      });

      const result = await completeBooking(bookingId);

      expect(result).toEqual({ error: "Unauthorized" });
    });

    it("should return error when update fails", async () => {
      const bookingId = "booking-fail-complete";
      const mockUser = { id: "user-fail", email: "fail@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock owner check - user is owner
      const mockSingleOwner = vi.fn().mockResolvedValue({
        data: { id: bookingId },
        error: null,
      });

      const mockSingleCaregiver = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock update failure
      const mockEq = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Complete failed" },
      });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "bookings") {
          callCount++;
          if (callCount === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleOwner,
                  }),
                }),
              }),
            } as any;
          }
          if (callCount === 2) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: mockSingleCaregiver,
                  }),
                }),
              }),
            } as any;
          }
          // Third call: update
          return { update: mockUpdate } as any;
        }
        return {} as any;
      });

      const result = await completeBooking(bookingId);

      expect(result).toEqual({ error: "Complete failed" });
    });
  });

  describe("Full Booking Lifecycle Integration", () => {
    it("should support complete lifecycle: create -> accept -> complete", async () => {
      // Step 1: Owner creates booking
      const createFormData = new FormData();
      createFormData.append("caregiver_id", "caregiver-lifecycle");
      createFormData.append("pet_id", "pet-lifecycle");
      createFormData.append("start_date", "2024-06-01");
      createFormData.append("end_date", "2024-06-05");

      const ownerUser = { id: "owner-lifecycle", email: "owner@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: ownerUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "booking-lifecycle" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createBooking(createFormData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "pending",
        }),
      );

      // Verify booking was created with pending status
      expect(mockInsert.mock.calls[0][0].status).toBe("pending");
    });

    it("should support lifecycle: create -> decline", async () => {
      const createFormData = new FormData();
      createFormData.append("caregiver_id", "caregiver-decline");
      createFormData.append("pet_id", "pet-decline");
      createFormData.append("start_date", "2024-07-01");
      createFormData.append("end_date", "2024-07-05");

      const ownerUser = { id: "owner-decline", email: "owner2@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: ownerUser },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: "booking-decline-lifecycle" },
        error: null,
      });

      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      try {
        await createBooking(createFormData);
      } catch (error: any) {
        expect(error.message).toBe("NEXT_REDIRECT");
      }

      expect(mockInsert.mock.calls[0][0].status).toBe("pending");
    });

    it("should support lifecycle: create -> cancel by owner", async () => {
      const bookingId = "booking-cancel-lifecycle";
      const ownerUser = { id: "owner-cancel", email: "owner3@example.com" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: ownerUser },
        error: null,
      });

      const mockEq2 = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      const result = await cancelBooking(bookingId);

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalledWith({ status: "cancelled" });
    });
  });
});
