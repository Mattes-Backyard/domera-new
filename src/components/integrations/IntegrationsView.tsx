
import { useState } from "react";
import { integrations } from "./integrationsData";
import { IntegrationCategory } from "./IntegrationCategory";
import { DialogManager } from "./DialogManager";

export const IntegrationsView = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleConfigure = (integrationName: string) => {
    console.log(`Opening configuration for ${integrationName}`);
    setOpenDialog(integrationName);
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
          <p className="text-gray-600">Connect your storage facility with powerful third-party tools and services.</p>
        </div>

        {integrations.map((category) => (
          <IntegrationCategory
            key={category.category}
            category={category.category}
            items={category.items}
            onConfigure={handleConfigure}
          />
        ))}
      </div>

      <DialogManager openDialog={openDialog} onClose={closeDialog} />
    </div>
  );
};
