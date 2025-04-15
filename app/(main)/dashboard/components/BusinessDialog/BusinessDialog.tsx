import { authClient } from "@/lib/auth-client";
import { Business, ServiceCatalog } from "@/db/schema";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  Form,
} from "@/components/ui";
import { FormControl, FormField } from "@/components/ui/form";

export function BusinessDialog({
  business,
  dialogOpen,
  setDialogOpen,
}: {
  business: Business | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const form = useForm<Business>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      serviceCatalogId: "",
    },
  });

  // Reset form when business changes
  useEffect(() => {
    if (business) {
      form.reset(business);
    }
  }, [business, form]);

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      return response.json();
    },
  });

  if (!session) {
    return null;
  }

  const handleCreateBusiness = useMutation({
    mutationFn: async (data: Business) => {
      const businessResponse = await fetch("/api/businesses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const businessData = await businessResponse.json();
      await fetch("/api/services", {
        method: "POST",
        body: JSON.stringify({
          businessId: businessData.id,
          serviceCatalogId: data.serviceCatalogId,
        }),
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
      if (business) {
        await fetch(`/api/businesses/${business.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      }
      // await fetch(`/api/services/${business.id}`, {
      //   method: "PUT",
      //   body: JSON.stringify({
      //     businessId: data.id,
      //     catalogId: data.serviceCatalogId,
      //   }),
      // });
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
        <Button>{business ? "Update" : "Create Business"}</Button>
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
        <Form {...form}>
          <form
            className="flex-col items-center"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="name">Name</Label>
              <Input {...form.register("name")} disabled={loading} />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="description">Description</Label>
              <Input {...form.register("description")} disabled={loading} />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="address">Address</Label>
              <Input {...form.register("address")} disabled={loading} />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="phone">Phone</Label>
              <Input {...form.register("phone")} disabled={loading} />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="website">Website</Label>
              <Input {...form.register("website")} disabled={loading} />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="services">Services</Label>
              <FormField
                control={form.control}
                name="serviceCatalogId"
                render={({ field }) => (
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.services.map((service: ServiceCatalog) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
