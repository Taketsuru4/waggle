"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPet(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const weight = formData.get("weight");
  const age = formData.get("age");

  const { error } = await supabase.from("pets").insert({
    owner_id: user.id,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    breed: formData.get("breed") as string,
    age: age ? Number.parseInt(age as string) : null,
    weight: weight ? Number.parseFloat(weight as string) : null,
    description: formData.get("description") as string,
    special_needs: formData.get("special_needs") as string,
  });

  if (error) {
    console.error("Error creating pet:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updatePet(petId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const weight = formData.get("weight");
  const age = formData.get("age");

  const { error } = await supabase
    .from("pets")
    .update({
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      breed: formData.get("breed") as string,
      age: age ? Number.parseInt(age as string) : null,
      weight: weight ? Number.parseFloat(weight as string) : null,
      description: formData.get("description") as string,
      special_needs: formData.get("special_needs") as string,
    })
    .eq("id", petId)
    .eq("owner_id", user.id); // Ensure user owns the pet

  if (error) {
    console.error("Error updating pet:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePet(petId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("pets")
    .delete()
    .eq("id", petId)
    .eq("owner_id", user.id); // Ensure user owns the pet

  if (error) {
    console.error("Error deleting pet:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
