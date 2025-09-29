import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useAuth } from '../hooks/useAuth';
import { usePositions, usePositionFilters } from '../hooks';
import { Button } from '../components/ui';
import { Modal } from '../components/ui/Modal';
import InterviewForm from '../components/interviews/InterviewForm';
import { PositionList, DashboardSummary } from '../components';
import { useCreateInterview } from '../hooks/useInterviews';
import { Position, CreateInterviewData } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
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
  const createInterviewMutation = useCreateInterview();

  // Modal state
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0); // Key to force form reset

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/positions/create');
  };

  const handleEditPosition = (position: Position) => {
    // TODO: Navigate to edit position page or open modal
    console.log('Edit position:', position.id);
    navigate(`/positions/${position.id}/edit`);
  };

  const handleDeletePosition = (id: string) => {
    // TODO: Show confirmation dialog and delete
    console.log('Delete position:', id);
    if (window.confirm('Are you sure you want to delete this position?')) {
      // Delete logic will be implemented in task 5.3
    }
  };

  const handleAddInterview = (positionId: string) => {
    console.log('Add interview for position:', positionId);
    setSelectedPositionId(positionId);
    setFormKey(prev => prev + 1); // Force form reset
    setShowInterviewForm(true);
  };

  const handleInterviewSubmit = async (data: CreateInterviewData) => {
    try {
      await createInterviewMutation.mutateAsync(data);
      setShowInterviewForm(false);
      setSelectedPositionId(null);
      toast.success('Interview scheduled successfully!');
      // Refresh the positions data
      refetchPositions();
    } catch (error) {
      toast.error('Failed to schedule interview');
      console.error('Error creating interview:', error);
    }
  };

  const handleViewDetails = (id: string) => {
    // TODO: Navigate to position details page
    console.log('View position details:', id);
    navigate(`/positions/${id}`);
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
                  Interview Position Tracker
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.first_name} {user?.last_name}!
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="primary"
                  onClick={() => navigate('/statistics')}
                >
                  View Statistics
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  loading={authLoading}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-8">
            {/* Dashboard Summary */}
            <DashboardSummary 
              positions={positions}
              loading={positionsLoading}
            />

            {/* Position List */}
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
              showFilters={true}
            />
          </div>
        </div>

        {/* Interview Form Modal */}
        {showInterviewForm && selectedPositionId && (
          <Modal
            isOpen={showInterviewForm}
            onClose={() => {
              setShowInterviewForm(false);
              setSelectedPositionId(null);
            }}
            title="Schedule New Interview"
            size="lg"
          >
            <InterviewForm
              key={formKey}
              positionId={selectedPositionId}
              onSubmit={handleInterviewSubmit}
              onCancel={() => {
                setShowInterviewForm(false);
                setSelectedPositionId(null);
              }}
              onSuccess={() => {
                // Reset form state after successful submission
                setFormKey(prev => prev + 1);
              }}
              loading={createInterviewMutation.isPending}
              mode="create"
            />
          </Modal>
        )}
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;