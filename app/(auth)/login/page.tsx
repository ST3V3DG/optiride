import Loader from "@/components/loader";
import LoginForm from "@/components/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center p-6 min-h-svh bg-muted md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<Loader />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
