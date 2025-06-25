
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ServiceRequest } from '@/types/modul8';
import { ProposalCard } from '@/types/proposalCards';
import { ExternalLink, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ContractCreationModalProps {
  isOpen: boolean;
  serviceRequest: ServiceRequest;
  proposal?: ProposalCard;
  onClose: () => void;
  onCreateContract: () => void;
}

const ContractCreationModal: React.FC<ContractCreationModalProps> = ({
  isOpen,
  serviceRequest,
  proposal,
  onClose,
  onCreateContract
}) => {
  const [contractData, setContractData] = useState({
    projectTitle: proposal?.negotiated_title || serviceRequest.title || '',
    projectDescription: proposal?.negotiated_description || serviceRequest.description || '',
    contractorName: '',
    clientName: '',
    amount: proposal?.negotiated_budget_range?.min || 0,
    currency: proposal?.negotiated_budget_range?.currency || 'USD',
    timeline: proposal?.negotiated_timeline || serviceRequest.timeline || '',
    terms: ''
  });

  const handleCreateContract = () => {
    // Construct DEEL URL with project parameters
    const deelParams = new URLSearchParams({
      project_title: contractData.projectTitle,
      project_description: contractData.projectDescription,
      contractor_name: contractData.contractorName,
      client_name: contractData.clientName,
      amount: contractData.amount.toString(),
      currency: contractData.currency,
      timeline: contractData.timeline,
      terms: contractData.terms
    });

    // Open DEEL in new tab with project details
    const deelUrl = `https://deel.com/contracts/new?${deelParams.toString()}`;
    window.open(deelUrl, '_blank');

    toast({
      title: "Contract Creation Initiated",
      description: "DEEL has been opened with your project details. Complete the contract creation there.",
      variant: "default"
    });

    onCreateContract();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Contract with DEEL
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                value={contractData.projectTitle}
                onChange={(e) => setContractData(prev => ({ ...prev, projectTitle: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={contractData.timeline}
                onChange={(e) => setContractData(prev => ({ ...prev, timeline: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              value={contractData.projectDescription}
              onChange={(e) => setContractData(prev => ({ ...prev, projectDescription: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractorName">Contractor Name</Label>
              <Input
                id="contractorName"
                value={contractData.contractorName}
                onChange={(e) => setContractData(prev => ({ ...prev, contractorName: e.target.value }))}
                placeholder="Service provider name"
              />
            </div>
            
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={contractData.clientName}
                onChange={(e) => setContractData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Organizer name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Contract Amount</Label>
              <Input
                id="amount"
                type="number"
                value={contractData.amount}
                onChange={(e) => setContractData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={contractData.currency}
                onChange={(e) => setContractData(prev => ({ ...prev, currency: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="terms">Additional Terms</Label>
            <Textarea
              id="terms"
              value={contractData.terms}
              onChange={(e) => setContractData(prev => ({ ...prev, terms: e.target.value }))}
              rows={3}
              placeholder="Any additional contract terms or conditions"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateContract}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Contract with DEEL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractCreationModal;
