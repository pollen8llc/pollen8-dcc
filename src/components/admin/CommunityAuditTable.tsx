
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

// Define type for the profiles join
interface UserProfile {
  email: string;
  first_name: string | null;
  last_name: string | null;
}

// Define type for the raw data returned from Supabase
interface RawAuditLog {
  action: string;
  details: any; // Using any here as it will be cast appropriately
  performed_by: string;
  created_at: string;
  profiles: UserProfile | null;
}

// Define the expected shape of community audit details
interface CommunityAudit {
  action: string;
  details: {
    community_id: string;
    community_name: string;
    ip_address?: string;
    timestamp?: string;
    user_agent?: string;
  };
  performed_by: string;
  created_at: string;
  profiles?: UserProfile | null;
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
          profiles(email, first_name, last_name)
        `)
        .eq('action', 'community_created')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the raw data to match our expected type
      return (data as RawAuditLog[]).map(log => ({
        action: log.action,
        details: log.details as CommunityAudit['details'],
        performed_by: log.performed_by,
        created_at: log.created_at,
        profiles: log.profiles
      })) as CommunityAudit[];
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
                {log.profiles?.email || 'Unknown'}
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
