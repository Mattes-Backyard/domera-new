
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useEffect, useState } from "react";

interface CompanyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CompanyLogo = ({
  size = 'md',
  className = ''
}: CompanyLogoProps) => {
  const { companyInfo } = useCompanySettings();
  const [logoKey, setLogoKey] = useState(0);

  // Force re-render when logo URL changes
  useEffect(() => {
    setLogoKey(prev => prev + 1);
  }, [companyInfo?.logo_url]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  // Use uploaded logo if available, otherwise show default Domera icon
  const logoSrc = companyInfo?.logo_url || '/lovable-uploads/aa4e4530-c735-48d1-93c8-a9372425fab5.png';
  const fallbackText = companyInfo?.company_name?.charAt(0) || 'D';

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        key={logoKey}
        src={logoSrc} 
        alt={companyInfo?.company_name || 'Domera Logo'} 
      />
      <AvatarFallback className={`${textSizeClasses[size]} font-semibold bg-blue-100 text-blue-600`}>
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
};
