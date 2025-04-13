"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Business } from "@/types/Business";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BusinessDialog({ business }: { business: Business }) {
  const methods = useForm<Business>({
    defaultValues: business,
  });

  const handleUpdateBusiness = useMutation({
    mutationFn: async (data: Business) => {
      await fetch(`/api/businesses/${business.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  });

  const onSubmit = (data: Business) => {
    handleUpdateBusiness.mutate(data);
  };

  if (!business) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create Business</Button>
          <DialogDescription>You have no businesses yet.</DialogDescription>
        </DialogTrigger>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update Business</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Business</DialogTitle>
          <DialogDescription>
            Update the details of your business.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex-col items-center"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              {...methods.register("name")}
              disabled={handleUpdateBusiness.isPending}
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="description">Description</Label>
            <Input
              {...methods.register("description")}
              disabled={handleUpdateBusiness.isPending}
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="address">Address</Label>
            <Input
              {...methods.register("address")}
              disabled={handleUpdateBusiness.isPending}
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              {...methods.register("phone")}
              disabled={handleUpdateBusiness.isPending}
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="website">Website</Label>
            <Input
              {...methods.register("website")}
              disabled={handleUpdateBusiness.isPending}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="secondary">
              {handleUpdateBusiness.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const DashboardContent = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard", {
        method: "GET",
      });
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleCreateBusiness = async () => {
    await fetch("/api/dashboard", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Business",
      }),
    });
  };

  if (!businesses) {
    return (
      <div>
        <h1>No businesses found</h1>
        <Button onClick={handleCreateBusiness}>Create Business</Button>
      </div>
    );
  }

  const business = businesses[0];

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
        <Button onClick={handleCreateBusiness}>Create Business</Button>
        <p>{session?.user?.email}</p>
      </div>
      <BusinessDialog business={business} />
    </>
  );
};

export default DashboardContent;
