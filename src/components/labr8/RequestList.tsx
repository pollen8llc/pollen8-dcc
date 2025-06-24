
import React from "react";
import RequestCard from "./RequestCard";
import { ServiceRequest } from "@/types/modul8";
import { Card, CardContent } from "@/components/ui/card";

interface RequestListProps {
  title?: string;
  requests: ServiceRequest[];
  type: "incoming" | "active" | "completed";
  loading?: boolean;
  emptyLabel?: string;
  onDelete?: () => void;
}

const RequestList: React.FC<RequestListProps> = ({
  title,
  requests,
  type,
  loading,
  emptyLabel,
  onDelete,
}) => (
  <div className="space-y-4">
    {title && <h4 className="text-lg font-bold mb-2">{title}</h4>}
    {loading ? (
      <Card>
        <CardContent className="flex flex-col justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00eada] mb-2"></div>
          <div className="text-muted-foreground">Loading requests...</div>
        </CardContent>
      </Card>
    ) : requests.length > 0 ? (
      <div className="grid gap-4">
        {requests.map(r => (
          <RequestCard key={r.id} request={r} type={type} onDelete={onDelete} />
        ))}
      </div>
    ) : (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <span className="mb-2">{emptyLabel ?? "No requests to display."}</span>
        </CardContent>
      </Card>
    )}
  </div>
);

export default RequestList;
