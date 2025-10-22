import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Globe,
  FileText,
  Plus,
  Trash2,
  Save,
  Upload,
} from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { formatRelativeTime } from '../utils/format';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

interface ProfileForm {
  name: string;
  timezone: string;
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'sources' | 'writing'>('profile');
  const [isAddingSample, setIsAddingSample] = useState(false);
  const [newSample, setNewSample] = useState('');

  const { data: user, loading: userLoading, refetch: refetchUser } = useApi(
    () => apiClient.getCurrentUser(),
    []
  );

  const { data: writingSamples, loading: samplesLoading, refetch: refetchSamples } = useApi(
    () => apiClient.getWritingSamples(),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>();

  const updateProfileMutation = useMutation(apiClient.updateProfile);
  const createSampleMutation = useMutation(apiClient.createWritingSample);
  const deleteSampleMutation = useMutation(apiClient.deleteWritingSample);

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        timezone: user.timezone || 'UTC',
      });
    }
  }, [user, reset]);

  const onSubmitProfile = async (data: ProfileForm) => {
    try {
      await updateProfileMutation.mutate(data);
      toast.success('Profile updated successfully');
      refetchUser();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddSample = async () => {
    if (!newSample.trim()) return;
    
    try {
      await createSampleMutation.mutate(newSample);
      setNewSample('');
      setIsAddingSample(false);
      toast.success('Writing sample added successfully');
      refetchSamples();
    } catch (error) {
      toast.error('Failed to add writing sample');
    }
  };

  const handleDeleteSample = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this writing sample?')) {
      try {
        await deleteSampleMutation.mutate(id);
        toast.success('Writing sample deleted successfully');
        refetchSamples();
      } catch (error) {
        toast.error('Failed to delete writing sample');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          setNewSample(content);
          setIsAddingSample(true);
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'sources', name: 'Content Sources', icon: Globe },
    { id: 'writing', name: 'Writing Samples', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon
                className={cn(
                  'mr-2 h-5 w-5',
                  activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal information and timezone.
            </p>
          </div>
          <div className="card-body">
            {userLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="mt-1 input"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="mt-1 input bg-gray-50"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      {...register('timezone', { required: 'Timezone is required' })}
                      className="mt-1 input"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                    {errors.timezone && (
                      <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={user?.created_at ? formatRelativeTime(user.created_at) : 'Unknown'}
                      disabled
                      className="mt-1 input bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.loading}
                    className="btn-primary"
                  >
                    {updateProfileMutation.loading ? (
                      <div className="spinner mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Content Sources
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your content sources for newsletter generation.
            </p>
          </div>
          <div className="card-body">
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Content Sources</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your content sources in the dedicated sources page.
              </p>
              <div className="mt-6">
                <a href="/sources" className="btn-primary">
                  Manage Sources
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Samples Tab */}
      {activeTab === 'writing' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Writing Samples
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload your writing samples to help AI learn your style.
              </p>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsAddingSample(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sample
                  </button>
                  <label className="btn-secondary cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                    <input
                      type="file"
                      accept=".txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  {samplesLoading ? '...' : writingSamples?.length || 0} samples
                </div>
              </div>

              {/* Add Sample Form */}
              {isAddingSample && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Add Writing Sample</h4>
                  <textarea
                    value={newSample}
                    onChange={(e) => setNewSample(e.target.value)}
                    placeholder="Paste your writing sample here..."
                    className="input w-full h-32 resize-none"
                  />
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsAddingSample(false);
                        setNewSample('');
                      }}
                      className="btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSample}
                      disabled={!newSample.trim() || createSampleMutation.loading}
                      className="btn-primary btn-sm"
                    >
                      {createSampleMutation.loading ? (
                        <div className="spinner mr-1" />
                      ) : null}
                      Add Sample
                    </button>
                  </div>
                </div>
              )}

              {/* Samples List */}
              {samplesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="spinner" />
                </div>
              ) : writingSamples && writingSamples.length > 0 ? (
                <div className="space-y-3">
                  {writingSamples.map((sample) => (
                    <div key={sample.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 line-clamp-3">
                            {sample.content}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Added {sample.created_at ? formatRelativeTime(sample.created_at) : 'Unknown'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSample(sample.id)}
                          className="ml-4 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No writing samples</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add writing samples to help AI learn your style.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
