import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  RefreshCw,
  X,
} from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { Newsletter } from '../types';
import { formatDateTime, formatRelativeTime, truncateText } from '../utils/format';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const Newsletters: React.FC = () => {
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: newsletters, loading, refetch } = useApi(() => apiClient.getNewsletters(), []);
  
  const generateMutation = useMutation(apiClient.generateNewsletter);
  const deleteMutation = useMutation(apiClient.deleteNewsletter);

  const handleGenerateNewsletter = async () => {
    setIsGenerating(true);
    try {
      await generateMutation.mutate({});
      toast.success('Newsletter generated successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to generate newsletter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      try {
        await deleteMutation.mutate(id);
        toast.success('Newsletter deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete newsletter');
      }
    }
  };

  const handleViewNewsletter = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
  };

  const handleCloseModal = () => {
    setSelectedNewsletter(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Newsletters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and generate your AI-powered newsletters.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            onClick={() => refetch()}
            className="btn-secondary"
            disabled={loading}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </button>
          <button
            onClick={handleGenerateNewsletter}
            disabled={isGenerating || generateMutation.loading}
            className="btn-primary"
          >
            {isGenerating || generateMutation.loading ? (
              <div className="spinner mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Generate Newsletter
          </button>
        </div>
      </div>

      {/* Newsletters List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      ) : newsletters && newsletters.length > 0 ? (
        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <div key={newsletter.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Newsletter #{newsletter.id.slice(-8)}
                      </h3>
                      <span className={cn(
                        'badge',
                        newsletter.sent_at ? 'badge-success' : 'badge-warning'
                      )}>
                        {newsletter.sent_at ? 'Sent' : 'Draft'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      Created {formatRelativeTime(newsletter.created_at)}
                      {newsletter.sent_at && (
                        <span className="ml-2">
                          • Sent {formatDateTime(newsletter.sent_at)}
                        </span>
                      )}
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 line-clamp-3">
                        {truncateText(newsletter.content, 200)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewNewsletter(newsletter)}
                      className="text-gray-400 hover:text-gray-600"
                      title="View newsletter"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/newsletters/${newsletter.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                      title="Edit newsletter"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteNewsletter(newsletter.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete newsletter"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/newsletters/${newsletter.id}`}
                      className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                  
                  {!newsletter.sent_at && (
                    <div className="flex items-center space-x-2">
                      <button className="btn-secondary btn-sm">
                        <Send className="h-3 w-3 mr-1" />
                        Send Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No newsletters yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate your first newsletter to get started.
          </p>
          <div className="mt-6">
            <button
              onClick={handleGenerateNewsletter}
              disabled={isGenerating || generateMutation.loading}
              className="btn-primary"
            >
              {isGenerating || generateMutation.loading ? (
                <div className="spinner mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Generate Newsletter
            </button>
          </div>
        </div>
      )}

      {/* Newsletter View Modal */}
      {selectedNewsletter && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Newsletter #{selectedNewsletter.id.slice(-8)}
                      </h3>
                      <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      Created {formatRelativeTime(selectedNewsletter.created_at)}
                      {selectedNewsletter.sent_at && (
                        <span className="ml-2">
                          • Sent {formatDateTime(selectedNewsletter.sent_at)}
                        </span>
                      )}
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">
                        {selectedNewsletter.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleCloseModal}
                  className="btn-secondary sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletters;
