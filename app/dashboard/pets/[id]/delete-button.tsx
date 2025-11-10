"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePet } from "../actions";

export default function DeletePetButton({
  petId,
  petName,
}: {
  petId: string;
  petName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Είσαι σίγουρος ότι θέλεις να διαγράψεις το "${petName}"; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deletePet(petId);

    if (result?.error) {
      alert(`Σφάλμα: ${result.error}`);
      setIsDeleting(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
    >
      {isDeleting ? "Διαγραφή..." : "Διαγραφή Κατοικιδίου"}
    </button>
  );
}
