"use client";

import { useForm } from "@tanstack/react-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "./loader";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { useSearchParams } from 'next/navigation';

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return apiClient.get("/csrf-cookie").then(() => apiClient.post('/login', data));
    },
    onSuccess: (response) => {
        toast.success("Success!", {
          description: "User logged in.",
        });
      document.cookie = `token=${response.data.data.token}`;
      console.log(returnTo)
      router.push(String(returnTo));
      router.refresh();
    },
    onError: (error) => {
      form.reset({email: "", password: ""});
      toast.error("Error!", {
        description: "Invalid credential.",
      });
      console.log(error);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="hidden relative bg-muted md:block">
            <Image
              width={1}
              height={1}
              src="/next.svg"
              alt="Image"
              className="absolute inset-0 w-[80%] object-contain m-auto dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome !</h1>
                <p className="text-muted-foreground text-balance">
                  Create your Optiride account
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <form.Field
                  name="email"
                  validators={{
                    onSubmitAsync: async ({ value }) =>
                      !value
                        ? "The email field is required"
                        : !/\S+@\S+\.\S+/.test(value)
                        ? "Enter a valid email"
                        : undefined,
                  }}>
                  {(field) => (
                    <>
                      <Label htmlFor={field.name}>Email :</Label>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="Enter your email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500/90">
                          {field.state.meta.errors.join(",")}
                        </p>
                      )}
                    </>
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onSubmitAsync: async ({ value }) =>
                      !value
                        ? "The password field is required"
                        : value.length < 8
                        ? "The password field should have minimum 8 characters"
                        : undefined,
                  }}>
                  {(field) => (
                    <>
                      <Label htmlFor={field.name}>Password :</Label>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500/90">
                          {field.state.meta.errors.join(",")}
                        </p>
                      )}
                    </>
                  )}
                </form.Field>
              </div>
              <Button
                type="submit"
                className="w-full text-white cursor-pointer">
                {mutation.isPending ? (
                  <Loader className="" size="sm" />
                ) : (
                  "Sign Up"
                )}
              </Button>
              <div className="relative text-sm text-center after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="relative z-10 px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-6">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Continue with Apple</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-6">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Continue with Google</span>
                </Button>
              </div>
              <div className="text-sm text-center">
                Already have an account ?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Register
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
