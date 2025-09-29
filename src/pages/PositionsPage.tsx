import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthGuard } from '../components/auth/AuthGuard';
import { usePositions, usePositionFilters } from '../hooks';
import { PositionList } from '../components/positions';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import InterviewForm from '../components/interviews/InterviewForm';
import { useCreateInterview } from '../hooks/useInterviews';
import { Position, CreateInterviewData } from '../types';

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
  const createInterviewMutation = useCreateInterview();

  // Modal state
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0); // Key to force form reset

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
    setSelectedPositionId(positionId);
    setFormKey(prev => prev + 1); // Force form reset
    setShowInterviewForm(true);
  };

  const handleInterviewSubmit = async (data: CreateInterviewData | any) => {
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
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/statistics')}
                >
                  View Statistics
                </Button>
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

export default PositionsPage;