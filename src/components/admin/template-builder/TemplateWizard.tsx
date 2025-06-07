
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Settings, Eye, CheckCircle } from 'lucide-react';

interface TemplateWizardProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const steps = [
  {
    id: 1,
    title: 'Choose Layout',
    description: 'Select your template layout and colors',
    icon: Settings,
  },
  {
    id: 2,
    title: 'Add Components',
    description: 'Drag components to build your template',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Configure',
    description: 'Customize component properties',
    icon: Settings,
  },
  {
    id: 4,
    title: 'Preview',
    description: 'Review your template design',
    icon: Eye,
  },
  {
    id: 5,
    title: 'Save',
    description: 'Name and save your template',
    icon: CheckCircle,
  },
];

export const TemplateWizard: React.FC<TemplateWizardProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Template Creation Wizard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <Button
                key={step.id}
                variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                size="sm"
                onClick={() => onStepClick(step.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
                {isCompleted && (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {currentStep}</Badge>
            <span className="font-medium">{steps[currentStep - 1]?.title}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
