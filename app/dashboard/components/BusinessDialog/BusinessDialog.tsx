import { authClient } from "@/lib/auth-client";
import { Business } from "@/types/Business";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Button,
  Label,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui";

export function BusinessDialog({
  business,
  dialogOpen,
  setDialogOpen,
}: {
  business: Business;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const { data: session } = authClient.useSession();

  if (!session) {
    return null;
  }

  const methods = useForm<Business>({
    defaultValues: business,
  });

  const queryClient = useQueryClient();
  const handleCreateBusiness = useMutation({
    mutationFn: async (data: Business) => {
      await fetch("/api/businesses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setDialogOpen(false);
      toast.success("Business created successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_dashboard", session.user.id],
      });
    },
  });
  const handleUpdateBusiness = useMutation({
    mutationFn: async (data: Business) => {
      await fetch(`/api/businesses/${business.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setDialogOpen(false);
      toast.success("Business updated successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_dashboard", session.user.id],
      });
    },
  });

  const onSubmit = (data: Business) => {
    if (business) {
      handleUpdateBusiness.mutate(data);
    } else {
      handleCreateBusiness.mutate(data);
    }
  };

  const loading =
    handleUpdateBusiness.isPending || handleCreateBusiness.isPending;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {business ? "Update Business" : "Create Business"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {business ? "Update Business" : "Create Business"}
          </DialogTitle>
          <DialogDescription>
            {business
              ? "Update the details of your business."
              : "Create a new business."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex-col items-center"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="name">Name</Label>
            <Input {...methods.register("name")} disabled={loading} />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="description">Description</Label>
            <Input {...methods.register("description")} disabled={loading} />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="address">Address</Label>
            <Input {...methods.register("address")} disabled={loading} />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input {...methods.register("phone")} disabled={loading} />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="website">Website</Label>
            <Input {...methods.register("website")} disabled={loading} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="secondary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
