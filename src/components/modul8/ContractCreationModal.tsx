
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  FileText, 
  DollarSign, 
  Calendar,
  User,
  Building,
  CheckCircle
} from 'lucide-react';
import { ServiceRequest, Proposal } from '@/types/modul8';

interface ContractCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequest: ServiceRequest;
  proposal?: Proposal;
  onCreateContract: (contractData: ContractData) => void;
}

interface ContractData {
  clientName: string;
  providerName: string;
  projectTitle: string;
  projectDescription: string;
  amount: number;
  timeline: string;
  milestones: string[];
  terms: string;
}

const ContractCreationModal: React.FC<ContractCreationModalProps> = ({
  isOpen,
  onClose,
  serviceRequest,
  proposal,
  onCreateContract
}) => {
  const [contractData, setContractData] = useState<ContractData>({
    clientName: serviceRequest.organizer?.organization_name || '',
    providerName: serviceRequest.service_provider?.business_name || '',
    projectTitle: serviceRequest.title,
    projectDescription: serviceRequest.description || '',
    amount: proposal?.quote_amount || 0,
    timeline: proposal?.timeline || serviceRequest.timeline || '',
    milestones: Array.isArray(serviceRequest.milestones) 
      ? serviceRequest.milestones 
      : [],
    terms: proposal?.terms || ''
  });

  const handleCreateDealContract = () => {
    // Create Deel contract with pre-filled data
    const deelParams = new URLSearchParams({
      client_name: contractData.clientName,
      contractor_name: contractData.providerName,
      project_title: contractData.projectTitle,
      project_description: contractData.projectDescription,
      amount: contractData.amount.toString(),
      timeline: contractData.timeline,
      milestones: contractData.milestones.join('\n'),
      terms: contractData.terms
    });

    const deelUrl = `https://app.deel.com/contracts/create?${deelParams.toString()}`;
    
    // Call the callback to update the project status
    onCreateContract(contractData);
    
    // Open Deel in a new tab
    window.open(deelUrl, '_blank');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-[#00eada]" />
            Create Contract
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Project Summary */}
          <div className="bg-muted/20 p-6 rounded-lg border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Agreement Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Client</div>
                  <div className="font-medium">{contractData.clientName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Service Provider</div>
                  <div className="font-medium">{contractData.providerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Project Value</div>
                  <div className="font-medium">${contractData.amount.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Timeline</div>
                  <div className="font-medium">{contractData.timeline}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Details Form */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Contract Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={contractData.clientName}
                  onChange={(e) => setContractData(prev => ({ ...prev, clientName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="providerName">Service Provider Name</Label>
                <Input
                  id="providerName"
                  value={contractData.providerName}
                  onChange={(e) => setContractData(prev => ({ ...prev, providerName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                value={contractData.projectTitle}
                onChange={(e) => setContractData(prev => ({ ...prev, projectTitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                value={contractData.projectDescription}
                onChange={(e) => setContractData(prev => ({ ...prev, projectDescription: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Contract Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={contractData.amount}
                  onChange={(e) => setContractData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={contractData.timeline}
                  onChange={(e) => setContractData(prev => ({ ...prev, timeline: e.target.value }))}
                />
              </div>
            </div>

            {contractData.milestones.length > 0 && (
              <div className="space-y-2">
                <Label>Project Milestones</Label>
                <div className="space-y-2">
                  {contractData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="terms">Additional Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={contractData.terms}
                onChange={(e) => setContractData(prev => ({ ...prev, terms: e.target.value }))}
                rows={4}
                placeholder="Payment terms, revision policy, etc..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDealContract}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Contract in Deel
            </Button>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Clicking "Create Contract in Deel" will open Deel's contract creation page 
              with pre-filled project information. Both parties will need to review and sign the contract in Deel 
              to finalize the agreement.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractCreationModal;
