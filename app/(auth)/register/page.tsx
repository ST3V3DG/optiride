import RegisterForm from "@/components/register-form";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center p-6 min-h-svh bg-muted md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
}
