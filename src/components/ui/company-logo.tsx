
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface CompanyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CompanyLogo = ({
  size = 'md',
  className = ''
}: CompanyLogoProps) => {
  const { companyInfo } = useCompanySettings();

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

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={companyInfo?.logo_url} 
        alt={companyInfo?.company_name || 'Company Logo'} 
      />
      <AvatarFallback className={`${textSizeClasses[size]} font-semibold bg-blue-100 text-blue-600`}>
        {companyInfo?.company_name?.charAt(0) || 'C'}
      </AvatarFallback>
    </Avatar>
  );
};
