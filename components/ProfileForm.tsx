// app/components/ProfileForm.tsx

'use client';
import { useState } from 'react';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: Role;
}

interface ProfileFormProps {
  user: User;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [userData, setUserData] = useState<User>(user);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userData.id, ...formData }),
    });
    const updatedUser = await response.json();
    setUserData(updatedUser);
    setEditMode(false);
  };

  const handleDelete = async () => {
    await fetch('/api/deleteUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userData.id }),
    });
    setUserData(null);
  };

  if (!userData) {
    return <p>No user data found.</p>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      {editMode ? (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div>
          <img src={userData.imageUrl} alt="Profile Image" />
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role.name}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;