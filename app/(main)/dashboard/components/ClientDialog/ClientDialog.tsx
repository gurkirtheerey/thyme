"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Client } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Plus } from "lucide-react";

interface ClientDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  businessId: string;
}

export const ClientDialog = ({
  dialogOpen,
  setDialogOpen,
  businessId,
}: ClientDialogProps) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const form = useForm<Client>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      address: "",
    },
  });

  // const handleCreateClient = useMutation({
  //   mutationFn: async (client: Client) => {
  //     const response = await fetch("/api/clients", {
  //       method: "POST",
  //       body: JSON.stringify(client),
  //     });
  //     return response.json();
  //   },
  // });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form.getValues(), businessId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      toast.success("Client created successfully");
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["user_dashboard", session?.user.id],
      });
    } catch (error) {
      toast.error("Failed to create client");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...form.register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create Client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
