import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { updateUserInfo } from '../../redux/userFrontend/userFrontendAPI';

import Swal from 'sweetalert2';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

// Example usage of Swal for a simple alert
// Styled Components
// const EditContainer = styled.div`
//   padding: 1.5rem;
//   background: #ffffff;
//   border-radius: 0.5rem;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
//   space-y: 1rem;
// `;

const EditTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const FormGridFour = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #000000;
`;

const RequiredSpan = styled.span`
  color: #dc2626;
`;

const FormInput = styled.input`
  flex: 1;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #000000;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const FormSelect = styled.select`
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #000000;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const FormCheckbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  accent-color: #2563eb;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: #1e40af;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.2s ease;

  &:hover {
    background: #1e3a8a;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: #dc2626;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.2s ease;

  &:hover {
    background: #b91c1c;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
`;

const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: #4b5563;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: #374151;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;
// Styled Components (unchanged, assuming they are the same as provided)
const EditContainer = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  space-y: 1rem;
`;

// ... (other styled components remain unchanged)

const UserDetailsEditProfile = ({ userInfo, onCancel }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    country: userInfo?.country || 'Nepal',
    currency: userInfo?.currency || 'NPR',
    phoneNumber: userInfo?.phoneNumber || '',
    player_id: userInfo?.player_id || '',
    promoCode: userInfo?.promoCode || '',
    isVerified: userInfo?.isVerified || true,
    emailVerified: userInfo?.emailVerified || false, // Added emailVerified
    phoneNumberVerified: userInfo?.phoneNumberVerified || false, // Added phoneNumberVerified
    status: userInfo?.status || 'active',
    balance: userInfo?.balance || 0,
    deposit: userInfo?.deposit || 0,
    withdraw: userInfo?.withdraw || 0,
    bonusSelection: userInfo?.bonusSelection || '',
    role: userInfo?.role || 'user',
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(userInfo?.profileImage || null);

  const countryCurrencyMap = {
    Nepal: 'NPR',
    Pakistan: 'PKR',
    India: 'INR',
    Bangladesh: 'BDT',
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'country') {
      setFormData((prev) => ({
        ...prev,
        country: value,
        currency: countryCurrencyMap[value],
      }));
    } else {
      if (['balance', 'deposit', 'withdraw'].includes(name) && value < 0) {
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload only JPG, JPEG, or PNG images');
      return;
    }

    if (file.size > maxSize) {
      alert('Image size should not exceed 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (file) => {
    if (!file) return userInfo?.profileImage || null;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok) {
        return data.imageUrl;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    const imageUrl =
      formData.profileImage && formData.profileImage.name
        ? await handleImageUpload(formData.profileImage)
        : userInfo?.profileImage;

    if (imageUrl === null) {
      setUploading(false);
      return; // Stop submission if image upload fails
    }

    const updatedFormData = {
      ...formData,
      profileImage: imageUrl,
    };

    try {
      const resultAction = await dispatch(
        updateUserInfo({ userId: userInfo?._id, updateData: updatedFormData })
      );

      if (updateUserInfo.fulfilled.match(resultAction)) {
        Swal.fire('Success', 'User profile updated successfully', 'success');
        onCancel();
      } else {
        Swal.fire('Error', 'Failed to update user profile. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <EditContainer>
      <EditTitle>Edit User Information</EditTitle>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem>
            <FormLabel>
              Email <RequiredSpan>*</RequiredSpan>
            </FormLabel>
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </FormItem>
          <FormItem>
            <FormLabel>Profile Image</FormLabel>
            <ImageUploadContainer>
              {imagePreview && (
                <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${imagePreview}`} alt="Profile preview" />
              )}
              <UploadButton
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                <FaUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
              </UploadButton>
              <HiddenFileInput
                type="file"
                ref={fileInputRef}
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </ImageUploadContainer>
          </FormItem>
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormInput
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem>
            <FormLabel>
              Player ID <RequiredSpan>*</RequiredSpan>
            </FormLabel>
            <FormInput
              type="text"
              name="player_id"
              value={formData.player_id}
              onChange={handleChange}
              required
              disabled
            />
          </FormItem>
          <FormItem>
            <FormLabel>Promo Code</FormLabel>
            <FormInput
              type="text"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Bonus Selection</FormLabel>
            <FormInput
              type="number"
              step="0.01"
              name="bonusSelection"
              value={formData.bonusSelection}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Is Verified</FormLabel>
            <FormCheckbox
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Email Verified</FormLabel>
            <FormCheckbox
              type="checkbox"
              name="emailVerified"
              checked={formData.emailVerified}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Phone Number Verified</FormLabel>
            <FormCheckbox
              type="checkbox"
              name="phoneNumberVerified"
              checked={formData.phoneNumberVerified}
              onChange={handleChange}
            />
          </FormItem>
        </FormGrid>

        <FormGridFour>
          <FormItem>
            <FormLabel>
              Country <RequiredSpan>*</RequiredSpan>
            </FormLabel>
            <FormSelect
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="Nepal">Nepal</option>
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              <option value="Bangladesh">Bangladesh</option>
            </FormSelect>
          </FormItem>
          <FormItem>
            <FormLabel>
              Currency <RequiredSpan>*</RequiredSpan>
            </FormLabel>
            <FormInput
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              disabled
            />
          </FormItem>
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormSelect
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="deactivated">Deactivated</option>
            </FormSelect>
          </FormItem>
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormSelect
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </FormSelect>
          </FormItem>
          <FormItem>
            <FormLabel>Balance</FormLabel>
            <FormInput
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              min="0"
            />
          </FormItem>
          <FormItem>
            <FormLabel>Deposit</FormLabel>
            <FormInput
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              min="0"
            />
          </FormItem>
          <FormItem>
            <FormLabel>Withdraw</FormLabel>
            <FormInput
              type="number"
              name="withdraw"
              value={formData.withdraw}
              onChange={handleChange}
              min="0"
            />
          </FormItem>
        </FormGridFour>

        <ButtonContainer>
          <CancelButton type="button" onClick={onCancel} disabled={uploading}>
            <FaTimes /> Cancel
          </CancelButton>
          <SaveButton type="submit" disabled={uploading}>
            <FaSave /> {uploading ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </ButtonContainer>
      </form>
    </EditContainer>
  );
};

export default UserDetailsEditProfile;