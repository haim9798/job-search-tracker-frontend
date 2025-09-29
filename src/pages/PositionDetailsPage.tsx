import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { AuthGuard } from '../components/auth';
import { AppLayout } from '../components/layout';
import { PositionDetails } from '../components/positions';
import { Button } from '../components/ui';
import { Modal } from '../components/ui/Modal';
import InterviewForm from '../components/interviews/InterviewForm';
import { 
  usePosition, 
  useUpdatePosition, 
  useDeletePosition, 
  useUpdatePositionStatus 
} from '../hooks/usePositions';
import { useCreateInterview, useUpdateInterview, useDeleteInterview } from '../hooks/useInterviews';
import { PositionStatus, UpdatePositionData, CreateInterviewData, UpdateInterviewData, Interview } from '../types';

export const PositionDetailsPage: React.FC = () => {
  console.log('🚀 PositionDetailsPage loaded!');
  // Test if component loads at all - remove this after testing
  if (typeof window !== 'undefined') {
    setTimeout(() => alert('PositionDetailsPage component loaded successfully!'), 1000);
  }
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: position, isLoading, error, refetch: refetchPosition } = usePosition(id!);
  const updatePositionMutation = useUpdatePosition();
  const deletePositionMutation = useDeletePosition();
  const updateStatusMutation = useUpdatePositionStatus();
  const createInterviewMutation = useCreateInterview();
  const updateInterviewMutation = useUpdateInterview();
  const deleteInterviewMutation = useDeleteInterview();

  // Modal state
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const handleEdit = async (positionId: string, data: UpdatePositionData) => {
    try {
      await updatePositionMutation.mutateAsync({ id: positionId, data });
    } catch (error) {
      toast.error('Failed to update position');
      throw error; // Re-throw to let the component handle the error state
    }
  };

  const handleDelete = async (positionId: string) => {
    try {
      await deletePositionMutation.mutateAsync(positionId);
      toast.success('Position deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete position');
    }
  };

  const handleStatusUpdate = async (positionId: string, status: PositionStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: positionId, status });
    } catch (error) {
      toast.error('Failed to update position status');
      throw error;
    }
  };

  const handleAddInterview = (positionId: string) => {
    console.log('🔍 DEBUG: handleAddInterview called with positionId:', positionId);
    // Open interview form modal instead of alert
    setShowInterviewForm(true);
  };

  const handleInterviewSubmit = async (data: CreateInterviewData | UpdateInterviewData) => {
    try {
      if (editingInterview) {
        // Update existing interview
        await updateInterviewMutation.mutateAsync({ 
          id: editingInterview.id, 
          data: data as UpdateInterviewData 
        });
        setEditingInterview(null);
        toast.success('Interview updated successfully!');
      } else {
        // Create new interview
        await createInterviewMutation.mutateAsync(data as CreateInterviewData);
        setShowInterviewForm(false);
        toast.success('Interview scheduled successfully!');
      }
      // Force refetch of position data to update the UI
      await refetchPosition();
    } catch (error) {
      toast.error(editingInterview ? 'Failed to update interview' : 'Failed to schedule interview');
      console.error('Error with interview:', error);
    }
  };

  const handleEditInterview = (interview: Interview) => {
    setEditingInterview(interview);
    setShowInterviewForm(true);
  };

  const handleDeleteInterview = async (interviewId: string) => {
    console.log('🔍 DEBUG: Attempting to delete interview with ID:', interviewId);
    try {
      await deleteInterviewMutation.mutateAsync(interviewId);
      toast.success('Interview deleted successfully!');
      // Force refetch of position data to update the UI
      await refetchPosition();
    } catch (error) {
      console.error('🔍 DEBUG: Error deleting interview:', error);
      toast.error('Failed to delete interview');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!id) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Position Not Found</h1>
              <p className="text-gray-600 mt-2">The position you're looking for doesn't exist.</p>
              <Button
                variant="primary"
                onClick={handleBack}
                className="mt-4"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Error Loading Position</h1>
              <p className="text-gray-600 mt-2">
                There was an error loading the position details. Please try again.
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Position Details */}
          {position && (
            <PositionDetails
              position={position}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              onAddInterview={handleAddInterview}
              onEditInterview={handleEditInterview}
              onDeleteInterview={handleDeleteInterview}
              loading={isLoading}
            />
          )}
        </div>

        {/* Interview Form Modal */}
        {showInterviewForm && id && (
          <Modal
            isOpen={showInterviewForm}
            onClose={() => {
              setShowInterviewForm(false);
              setEditingInterview(null);
            }}
            title={editingInterview ? "Edit Interview" : "Schedule New Interview"}
            size="lg"
          >
            <InterviewForm
              interview={editingInterview || undefined}
              positionId={id}
              onSubmit={handleInterviewSubmit}
              onCancel={() => {
                setShowInterviewForm(false);
                setEditingInterview(null);
              }}
              loading={editingInterview ? updateInterviewMutation.isPending : createInterviewMutation.isPending}
              mode={editingInterview ? "edit" : "create"}
            />
          </Modal>
        )}
      </AppLayout>
    </AuthGuard>
  );
};

export default PositionDetailsPage;