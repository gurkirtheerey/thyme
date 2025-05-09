import { auth } from "@/lib/auth";
import LoginForm from "./login-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Page;
