"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Client } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Loading from "./loading";
const Page = () => {
  const router = useRouter();
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Clients</h1>
      <Table>
        <TableCaption>A list of your recent clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client: Client) => (
            <TableRow
              key={client.id}
              onClick={() => {
                router.push(`/clients/${client.id}`);
              }}
            >
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                {new Date(client.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">{client.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
