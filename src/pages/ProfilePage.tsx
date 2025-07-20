import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import ProfileView from '@/components/profile/ProfileView';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Determine which profile to show
  const profileId = id || currentUser?.id;
  const isOwnProfile = !id || id === currentUser?.id;

  // Redirect to auth if no user and no ID provided
  if (!profileId) {
    navigate('/auth');
    return null;
  }

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProfileView 
        profileId={profileId}
        isOwnProfile={isOwnProfile}
        onEdit={isOwnProfile ? handleEdit : undefined}
      />
    </div>
  );
};

export default ProfilePage;