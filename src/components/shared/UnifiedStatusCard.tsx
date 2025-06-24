
import { useState } from 'react';
import { ServiceRequest, Proposal } from '@/types/modul8';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Building2, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Upload,
  Edit
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StatusCardAction {
  id: string;
  type: 'proposal' | 'comment' | 'file_upload' | 'status_change' | 'acceptance' | 'completion';
  actor: 'organizer' | 'provider';
  timestamp: string;
  message?: string;
  files?: string[];
  proposal?: Proposal;
  status?: string;
  previousStatus?: string;
}

interface UnifiedStatusCardProps {
  serviceRequest: ServiceRequest;
  actions: StatusCardAction[];
  currentUserRole: 'organizer' | 'provider';
  onProposalAction?: (action: 'accept' | 'reject' | 'counter', proposalId: string, counterData?: any) => void;
  onStatusChange?: (newStatus: string, message?: string) => void;
  onComment?: (message: string) => void;
  onFileUpload?: (files: File[]) => void;
}

const UnifiedStatusCard = ({
  serviceRequest,
  actions,
  currentUserRole,
  onProposalAction,
  onStatusChange,
  onComment,
  onFileUpload
}: UnifiedStatusCardProps) => {
  const [newComment, setNewComment] = useState('');
  const [showCounterForm, setShowCounterForm] = useState<string | null>(null);
  const [counterData, setCounterData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agreed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending_review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <FileText className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'file_upload':
        return <Upload className="h-4 w-4" />;
      case 'acceptance':
        return <CheckCircle className="h-4 w-4" />;
      case 'completion':
        return <CheckCircle className="h-4 w-4" />;
      case 'status_change':
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleProposalAction = (action: 'accept' | 'reject' | 'counter', proposalId: string) => {
    if (action === 'counter') {
      setShowCounterForm(proposalId);
    } else {
      onProposalAction?.(action, proposalId);
    }
  };

  const handleCounterSubmit = (proposalId: string) => {
    const numericAmount = counterData.quote_amount ? parseFloat(counterData.quote_amount) : undefined;
    onProposalAction?.('counter', proposalId, {
      ...counterData,
      quote_amount: numericAmount
    });
    setShowCounterForm(null);
    setCounterData({ quote_amount: '', timeline: '', scope_details: '', terms: '' });
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onComment?.(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{serviceRequest.title}</h2>
              <p className="text-muted-foreground mt-1">{serviceRequest.description}</p>
            </div>
            <Badge className={`${getStatusColor(serviceRequest.status)} border text-sm font-medium`}>
              {serviceRequest.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Status Timeline */}
      <div className="space-y-4">
        {actions.map((action) => (
          <Card key={action.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {action.actor === 'organizer' ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getActionIcon(action.type)}
                    <span className="font-medium">
                      {action.actor === 'organizer' ? 'Organizer' : 'Service Provider'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {action.message && (
                    <p className="text-sm mb-3">{action.message}</p>
                  )}
                  
                  {action.proposal && (
                    <div className="bg-muted/20 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {action.proposal.quote_amount && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span>${action.proposal.quote_amount.toLocaleString()}</span>
                          </div>
                        )}
                        {action.proposal.timeline && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{action.proposal.timeline}</span>
                          </div>
                        )}
                      </div>
                      
                      {action.proposal.scope_details && (
                        <div className="mt-3">
                          <h4 className="font-medium text-sm mb-1">Scope Details</h4>
                          <p className="text-sm text-muted-foreground">{action.proposal.scope_details}</p>
                        </div>
                      )}
                      
                      {action.proposal.terms && (
                        <div className="mt-3">
                          <h4 className="font-medium text-sm mb-1">Terms</h4>
                          <p className="text-sm text-muted-foreground">{action.proposal.terms}</p>
                        </div>
                      )}

                      {/* Proposal Action Buttons */}
                      {action.proposal.status === 'pending' && 
                       currentUserRole === 'organizer' && 
                       action.actor === 'provider' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleProposalAction('accept', action.proposal!.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProposalAction('counter', action.proposal!.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Counter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProposalAction('reject', action.proposal!.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* Provider Proposal Actions */}
                      {action.proposal.status === 'pending' && 
                       currentUserRole === 'provider' && 
                       action.actor === 'organizer' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleProposalAction('accept', action.proposal!.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProposalAction('reject', action.proposal!.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Counter Offer Form */}
                  {showCounterForm === action.proposal?.id && (
                    <div className="bg-muted/10 rounded-lg p-4 mt-3 space-y-3">
                      <h4 className="font-medium">Counter Offer</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Quote Amount</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="5000"
                            value={counterData.quote_amount}
                            onChange={(e) => setCounterData(prev => ({ ...prev, quote_amount: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Timeline</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="2-3 weeks"
                            value={counterData.timeline}
                            onChange={(e) => setCounterData(prev => ({ ...prev, timeline: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Scope Details</label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          rows={3}
                          placeholder="Describe the scope modifications..."
                          value={counterData.scope_details}
                          onChange={(e) => setCounterData(prev => ({ ...prev, scope_details: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCounterSubmit(action.proposal!.id)}
                        >
                          Submit Counter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowCounterForm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {action.files && action.files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {action.files.map((file, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          📎 {file}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Comment Section */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment to this project..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                size="sm"
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedStatusCard;
