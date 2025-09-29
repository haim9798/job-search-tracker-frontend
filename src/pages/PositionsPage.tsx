import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthGuard } from '../components/auth/AuthGuard';
import { usePositions, usePositionFilters } from '../hooks';
import { PositionList } from '../components/positions';
import { Position } from '../types';

export const PositionsPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter state management
  const { filters, setFilters } = usePositionFilters();
  
  // Fetch positions data with filters
  const { 
    data: positionsResponse, 
    isLoading: positionsLoading, 
    error: positionsError,
    refetch: refetchPositions
  } = usePositions(filters);

  const positions = positionsResponse?.positions || [];

  const handleCreateNew = () => {
    navigate('/positions/create');
  };

  const handleEditPosition = (position: Position) => {
    navigate(`/positions/${position.id}/edit`);
  };

  const handleDeletePosition = (id: string) => {
    console.log('Delete position:', id);
    if (window.confirm('Are you sure you want to delete this position?')) {
      // Delete logic will be implemented in a future task
    }
  };

  const handleAddInterview = (positionId: string) => {
    console.log('🔍 DEBUG: PositionsPage handleAddInterview called with positionId:', positionId);
    alert(`Adding interview for position: ${positionId}`);
    // Create a simple interview with basic data
    console.log('🔍 DEBUG: About to import interview service...');
    import('../services/interviewService').then(({ interviewService }) => {
      console.log('🔍 DEBUG: Interview service imported successfully, calling createInterview...');
      interviewService.createInterview(positionId, {
        position_id: positionId,
        type: 'technical',
        place: 'video',
        scheduled_date: new Date().toISOString(),
        outcome: 'pending',
        notes: 'Interview scheduled from positions page'
      }).then(() => {
        console.log('🔍 DEBUG: Interview created successfully!');
        toast.success('Interview scheduled successfully!');
        // Refresh the positions data
        refetchPositions();
      }).catch((error) => {
        console.log('🔍 DEBUG: Error creating interview:', error);
        toast.error('Failed to schedule interview');
        console.error('Error creating interview:', error);
      });
    }).catch((error) => {
      console.log('🔍 DEBUG: Error loading interview service:', error);
      toast.error('Failed to load interview service');
      console.error('Error loading service:', error);
    });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/positions/${id}`);
  };

  const handleRefresh = async () => {
    await refetchPositions();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Positions
                </h1>
                <p className="text-gray-600">
                  Manage your job applications and track your progress
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <PositionList
              positions={positions}
              loading={positionsLoading}
              error={positionsError ? String(positionsError) : null}
              filters={filters}
              onFiltersChange={setFilters}
              onCreateNew={handleCreateNew}
              onEditPosition={handleEditPosition}
              onDeletePosition={handleDeletePosition}
              onAddInterview={handleAddInterview}
              onViewDetails={handleViewDetails}
              onRefresh={handleRefresh}
              showFilters={true}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default PositionsPage;