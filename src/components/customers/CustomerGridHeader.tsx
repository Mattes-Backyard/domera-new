
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Plus, Grid, List, Download, Mail, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DatabaseCustomer } from "@/types/customer";

interface CustomerGridHeaderProps {
  customers: DatabaseCustomer[];
  onAddCustomer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  facilityFilter: string;
  onFacilityFilterChange: (facility: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onClearFilters: () => void;
  facilities: any[];
  onBulkAction?: (action: string) => void;
}

export const CustomerGridHeader = ({
  customers,
  onAddCustomer,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  facilityFilter,
  onFacilityFilterChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  facilities,
  onBulkAction
}: CustomerGridHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [joinDateFilter, setJoinDateFilter] = useState("all");

  const activeFiltersCount = [statusFilter, facilityFilter, balanceFilter, joinDateFilter]
    .filter(f => f !== "all").length;
  const hasActiveFilters = activeFiltersCount > 0 || searchQuery;

  const uniqueStatuses = Array.from(new Set(customers.map(c => c.status).filter(Boolean)));

  // Calculate key metrics for facility managers
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const overdueCustomers = customers.filter(c => c.balance && c.balance > 0).length;
  const newCustomersThisMonth = customers.filter(c => {
    if (!c.join_date) return false;
    const joinDate = new Date(c.join_date);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  const clearAllFilters = () => {
    onClearFilters();
    setBalanceFilter("all");
    setJoinDateFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Header with Metrics */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {totalCustomers} Total
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {activeCustomers} Active
              </Badge>
              {overdueCustomers > 0 && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {overdueCustomers} Overdue
                </Badge>
              )}
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                +{newCustomersThisMonth} This Month
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onBulkAction?.('export')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => onBulkAction?.('send_reminders')}>
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button onClick={onAddCustomer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={balanceFilter} onValueChange={setBalanceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Balance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Balances</SelectItem>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={joinDateFilter} onValueChange={setJoinDateFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Join Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_quarter">This Quarter</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={facilityFilter} onValueChange={onFacilityFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Mobile Filter Sheet */}
        <div className="lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Customers</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Balance Status</label>
                  <Select value={balanceFilter} onValueChange={setBalanceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Balances" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Balances</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Join Date</label>
                  <Select value={joinDateFilter} onValueChange={setJoinDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="this_quarter">This Quarter</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Facility</label>
                  <Select value={facilityFilter} onValueChange={onFacilityFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearAllFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* View Mode Toggle */}
        <div className="flex border rounded-lg p-1 bg-gray-50">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="h-8 px-3"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary">Search: "{searchQuery}"</Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary">Status: {statusFilter}</Badge>
          )}
          {balanceFilter !== "all" && (
            <Badge variant="secondary">Balance: {balanceFilter}</Badge>
          )}
          {joinDateFilter !== "all" && (
            <Badge variant="secondary">Join Date: {joinDateFilter.replace('_', ' ')}</Badge>
          )}
          {facilityFilter !== "all" && (
            <Badge variant="secondary">
              Facility: {facilities.find(f => f.id === facilityFilter)?.name || facilityFilter}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
