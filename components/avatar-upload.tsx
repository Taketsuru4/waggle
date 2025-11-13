"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete?: (url: string) => void;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  onUploadComplete,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const supabase = createClient();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      onUploadComplete?.(publicUrl);
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error uploading avatar",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-32 w-32 rounded-full object-cover ring-4 ring-zinc-200 dark:ring-zinc-700"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-200 text-4xl dark:bg-zinc-700">
            👤
          </div>
        )}
      </div>

      <label
        htmlFor="avatar-upload"
        className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium ${
          uploading
            ? "bg-zinc-400 text-white"
            : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        JPG, PNG or GIF (max. 5MB)
      </p>
    </div>
  );
}
