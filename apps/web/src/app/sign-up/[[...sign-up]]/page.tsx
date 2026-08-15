import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { isMockAuth } from "@/lib/auth-mode";

export default function SignUpPage() {
  // No auth to perform in mock mode — go straight into the app.
  if (isMockAuth) redirect("/trips");
  return (
    <div className="flex justify-center py-10">
      <SignUp />
    </div>
  );
}
