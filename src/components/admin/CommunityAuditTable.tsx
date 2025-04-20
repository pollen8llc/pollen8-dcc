
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface CommunityAudit {
  action: string;
  details: {
    community_id: string;
    community_name: string;
    ip_address: string;
    timestamp: string;
    user_agent: string;
  };
  performed_by: string;
  created_at: string;
}

const CommunityAuditTable = () => {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['community-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          action,
          details,
          performed_by,
          created_at,
          profiles:performed_by (
            email,
            first_name,
            last_name
          )
        `)
        .eq('action', 'community_created')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CommunityAudit[];
    }
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading audit data...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Community Name</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>User Agent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs?.map((log) => (
            <TableRow key={log.details.community_id}>
              <TableCell className="font-medium">
                {log.details.community_name}
              </TableCell>
              <TableCell>
                {(log as any).profiles?.email || 'Unknown'}
              </TableCell>
              <TableCell>{log.details.ip_address || 'Not available'}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {log.details.user_agent || 'Not available'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommunityAuditTable;
