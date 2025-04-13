"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { signupSchema, type SignupFormData } from "@/schema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl } from "@/components/ui/form";
const SignupForm = () => {
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const handleSignup = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        image: "",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: data.email, role: data.role }),
      });

      router.push("/dashboard");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    handleSignup.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10"
      >
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="name">First Name</Label>
              <Input
                className="border border-gray-300 rounded-md p-2 w-full"
                type="text"
                {...register("firstName", { required: true })}
                disabled={handleSignup.isPending}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                className="border border-gray-300 rounded-md p-2 w-full"
                type="text"
                {...register("lastName", { required: true })}
                disabled={handleSignup.isPending}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="border border-gray-300 rounded-md p-2"
              type="text"
              {...register("email", { required: true })}
              disabled={handleSignup.isPending}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className="border border-gray-300 rounded-md p-2"
              type="password"
              {...register("password", { required: true })}
              disabled={handleSignup.isPending}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role" className="flex gap-2">
              Role
              <span className="text-xs text-gray-500">
                * This will be used to determine your role in the app
              </span>
            </Label>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={handleSignup.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              )}
            />
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>
        </div>
        <Button type="submit" disabled={handleSignup.isPending}>
          {handleSignup.isPending ? "Signing up..." : "Signup"}
        </Button>
        <p className="text-sm text-gray-500">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </Form>
  );
};

export default SignupForm;
