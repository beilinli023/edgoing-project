
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EmailVariable } from '@/types/emailTypes';

export interface VariableBadgesProps {
  emailVariables: EmailVariable[];
}

const VariableBadges: React.FC<VariableBadgesProps> = ({ emailVariables }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {emailVariables.map((variable) => (
        <TooltipProvider key={variable.key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                {variable.key}
                <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{variable.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default VariableBadges;
