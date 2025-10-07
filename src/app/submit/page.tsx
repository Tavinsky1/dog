import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import PlaceSubmissionForm from "@/components/PlaceSubmissionForm";

export default async function SubmitPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?callbackUrl=/submit");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-display font-bold text-slate-900">Add a Dog-Friendly Place</h1>
        <p className="text-lg text-slate-600">
          Know a great spot for dogs? Help grow the DogAtlas community by sharing your favorite places.
        </p>
      </div>

      <PlaceSubmissionForm />
    </div>
  );
}