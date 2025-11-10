import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { updatePet, deletePet } from "../actions";
import DeletePetButton from "./delete-button";

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!pet) {
    notFound();
  }

  const updatePetWithId = updatePet.bind(null, pet.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Πίσω
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Επεξεργασία: {pet.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <form
          action={updatePetWithId}
          className="space-y-6 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Όνομα *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={pet.name}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Τύπος *
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue={pet.type}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
              >
                <option value="dog">Σκύλος</option>
                <option value="cat">Γάτα</option>
                <option value="bird">Πουλί</option>
                <option value="rabbit">Κουνέλι</option>
                <option value="other">Άλλο</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="breed"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Ράτσα
              </label>
              <input
                id="breed"
                name="breed"
                type="text"
                defaultValue={pet.breed || ""}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Ηλικία (έτη)
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  defaultValue={pet.age || ""}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                />
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Βάρος (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  defaultValue={pet.weight || ""}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Περιγραφή
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={pet.description || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
            />
          </div>

          <div>
            <label
              htmlFor="special_needs"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Ειδικές Ανάγκες
            </label>
            <textarea
              id="special_needs"
              name="special_needs"
              rows={3}
              defaultValue={pet.special_needs || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
            />
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 rounded-md border border-zinc-300 px-6 py-3 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Ακύρωση
            </Link>
            <button
              type="submit"
              className="flex-1 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Αποθήκευση
            </button>
          </div>
        </form>

        {/* Delete Section */}
        <div className="mt-8 rounded-lg border-2 border-red-200 bg-white p-6 dark:border-red-900 dark:bg-zinc-800">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-400">
            Διαγραφή Κατοικιδίου
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </p>
          <DeletePetButton petId={pet.id} petName={pet.name} />
        </div>
      </div>
    </div>
  );
}
