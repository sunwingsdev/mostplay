import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPromotion, deletePromotion, fetchPromotions, updatePromotion } from '../redux/Deposit Control/promotionControlAPIAndSlice';
import { fetchMenuOptions } from '../redux/Frontend Control/GameNavControl/menuOptionSlice';
import { getDepositPaymentMethods } from '../redux/Deposit Control/depositPaymentGetawaySliceAndAPI';
import { baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled Components
const Container = styled.div`
  padding: 40px 20px;
  max-width: 1440px;
  margin: 0 auto;
  background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Header = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1e1b4b;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const FormCard = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 48px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid #c3dafe;
  border-radius: 10px;
  font-size: 1rem;
  color: #1e1b4b;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  direction: ltr;
  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
    transform: scale(1.02);
  }
  &::placeholder {
    color: #6b7280;
    opacity: 0.8;
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 10px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid #c3dafe;
  border-radius: 10px;
  font-size: 1rem;
  color: #1e1b4b;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  direction: ltr;
  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
    transform: scale(1.02);
  }
  &::placeholder {
    color: #6b7280;
    opacity: 0.8;
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 10px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid #c3dafe;
  border-radius: 10px;
  font-size: 1rem;
  color: #1e1b4b;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  direction: ltr;
  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
    transform: scale(1.02);
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 10px;
  }
`;

const MultiSelectContainer = styled.div`
  margin: 8px 0;
`;

const MultiSelectOption = styled.label`
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 1rem;
  color: #1e1b4b;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  accent-color: #7c3aed;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #7c3aed 0%, #db2777 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.5);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    box-shadow: none;
  }
  @media (max-width: 600px) {
    padding: 10px 18px;
    font-size: 0.95rem;
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(90deg, #f97316 0%, #facc15 100%);
  &:hover {
    box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
  }
`;

const PromotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PromotionCard = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  }
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const PromotionImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    height: 150px;
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  margin: 20px 0;
  font-size: 1rem;
  font-weight: 500;
  background: #fef2f2;
  padding: 16px;
  border-radius: 10px;
  border-left: 4px solid #dc2626;
`;

const LoadingMessage = styled.p`
  color: #4b5563;
  margin: 20px 0;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  background: #e5e7eb;
  padding: 16px;
  border-radius: 10px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  padding: 28px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #1e1b4b;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const BonusTitle = styled.h4`
  font-size: 1.1rem;
  color: #1e1b4b;
  font-weight: 600;
  margin: 16px 0 12px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: #1e1b4b;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const CardText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 12px;
  line-height: 1.6;
  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const BonusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const BonusField = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #4b5563;
  margin: 8px 0;
  font-weight: 500;
`;

export default function Promotion() {
  const dispatch = useDispatch();
  const { promotions, loading: promotionLoading, error: promotionError } = useSelector((state) => state.promotion);
  const { menuOptions, loading: menuLoading, error: menuError } = useSelector((state) => state.menuOption);
  const { depositPaymentMethods = [], loading: paymentLoading, error: paymentError } = useSelector((state) => state.depositPaymentGateway);

  const initialFormData = {
    img: '',
    title: '',
    title_bd: '',
    description: '',
    description_bd: '',
    game_type: '',
    payment_methods: [],
    promotion_bonuses: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPromotions());
    dispatch(fetchMenuOptions());
    dispatch(getDepositPaymentMethods());
  }, [dispatch]);

  const handleImageUpload = useCallback(async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error('Image upload failed');
      }
      return data.imageUrl;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (methodId) => {
    setFormData((prev) => {
      const isSelected = prev.payment_methods.includes(methodId);
      let newPaymentMethods;
      if (isSelected) {
        newPaymentMethods = prev.payment_methods.filter((id) => id !== methodId);
      } else {
        newPaymentMethods = [...prev.payment_methods, methodId];
      }
      // Update promotion_bonuses to reflect selected payment methods
      const newPromotionBonuses = newPaymentMethods.map((id) => {
        const existingBonus = prev.promotion_bonuses.find(
          (bonus) => bonus.payment_method.toString() === id.toString()
        );
        return (
          existingBonus || {
            payment_method: id,
            bonus_type: 'Fix',
            bonus: 0,
          }
        );
      });
      return {
        ...prev,
        payment_methods: newPaymentMethods,
        promotion_bonuses: newPromotionBonuses,
      };
    });
  };

  const handleBonusChange = (methodId, field, value) => {
    setFormData((prev) => {
      const newPromotionBonuses = prev.promotion_bonuses.map((bonus) => {
        if (bonus.payment_method.toString() === methodId.toString()) {
          return { ...bonus, [field]: field === 'bonus' ? parseFloat(value) || 0 : value };
        }
        return bonus;
      });
      return { ...prev, promotion_bonuses: newPromotionBonuses };
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title) {
      toast.error('Promotion Title is required');
      return;
    }
    if (!formData.title_bd) {
      toast.error('Title (Bangla) is required');
      return;
    }
    if (!formData.game_type) {
      toast.error('Game Type is required');
      return;
    }
    if (!editingId && !imageFile) {
      toast.error('Image is required for new promotions');
      return;
    }
    if (formData.payment_methods.length === 0) {
      toast.error('At least one payment method is required');
      return;
    }

    try {
      let imageUrl = formData.img;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const promotionData = {
        ...formData,
        img: imageUrl,
        payment_methods: formData.payment_methods,
        promotion_bonuses: formData.promotion_bonuses,
      };

      if (editingId) {
        await dispatch(updatePromotion({ id: editingId, data: promotionData })).unwrap();
        toast.success('Promotion updated successfully!');
      } else {
        await dispatch(createPromotion(promotionData)).unwrap();
        toast.success('Promotion created successfully!');
      }

      resetForm();
    } catch (err) {
      toast.error(`Failed to ${editingId ? 'update' : 'create'} promotion: ${err.message}`);
    }
  };

  const handleEdit = (promotion) => {
    setEditingId(promotion._id);
    setFormData({
      img: promotion.img,
      title: promotion.title,
      title_bd: promotion.title_bd,
      description: promotion.description || '',
      description_bd: promotion.description_bd || '',
      game_type: promotion.game_type ? promotion.game_type.toString() : '',
      payment_methods: promotion.payment_methods.map((id) => id.toString()),
      promotion_bonuses: promotion.promotion_bonuses.map((bonus) => ({
        payment_method: bonus.payment_method.toString(),
        bonus_type: bonus.bonus_type,
        bonus: bonus.bonus,
      })),
    });
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePromotion(id)).unwrap();
      toast.success('Promotion deleted successfully!');
    } catch (err) {
      toast.error(`Failed to delete promotion: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header>
        <Title>Promotion Dashboard</Title>
      </Header>

      <FormCard onSubmit={handleSubmit}>
        <SectionTitle>{editingId ? 'Edit Promotion' : 'Create New Promotion'}</SectionTitle>

        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>
          <Label>Promotion Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!editingId}
            ref={imageInputRef}
          />
          {imageFile && <Label>Selected: {imageFile.name}</Label>}
          {editingId && formData.img && !imageFile && <Label>Current Image: {formData.img}</Label>}
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Promotion Title"
            required
          />
          <Input
            type="text"
            name="title_bd"
            value={formData.title_bd}
            onChange={handleInputChange}
            placeholder="Title (Bangla)"
            required
          />
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <TextArea
            name="description_bd"
            value={formData.description_bd}
            onChange={handleInputChange}
            placeholder="Description (Bangla)"
          />
          <Select
            name="game_type"
            value={formData.game_type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Game Type</option>
            {(menuOptions || []).map((option) => (
              <option key={option._id} value={option._id}>
                {option.title}
              </option>
            ))}
          </Select>
        </FormSection>

        <FormSection>
          <SectionTitle>Payment Methods</SectionTitle>
          {paymentLoading ? (
            <LoadingMessage>Loading payment methods...</LoadingMessage>
          ) : paymentError ? (
            <ErrorMessage>Failed to load payment methods: {paymentError}</ErrorMessage>
          ) : depositPaymentMethods.length === 0 ? (
            <Label>No payment methods available.</Label>
          ) : (
            <MultiSelectContainer>
              {depositPaymentMethods.map((method) => (
                <MultiSelectOption key={method._id}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.payment_methods.includes(method._id.toString())}
                    onChange={() => handlePaymentMethodChange(method._id.toString())}
                  />
                  {method.methodName} ({method.methodNameBD})
                </MultiSelectOption>
              ))}
            </MultiSelectContainer>
          )}
        </FormSection>

        <FormSection>
          <SectionTitle>Bonus Settings</SectionTitle>
          {formData.payment_methods.length === 0 ? (
            <Label>No payment methods selected. Please select at least one payment method.</Label>
          ) : (
            <BonusGrid>
              {formData.payment_methods.map((methodId) => {
                const method = depositPaymentMethods.find((m) => m._id.toString() === methodId) || {};
                const bonus = formData.promotion_bonuses.find(
                  (b) => b.payment_method.toString() === methodId
                ) || { bonus_type: 'Fix', bonus: 0 };
                return (
                  <BonusField key={methodId}>
                    <BonusTitle>
                      {method.methodName ? `${method.methodName} Bonus` : 'Unknown Method'}
                    </BonusTitle>
                    <Select
                      value={bonus.bonus_type}
                      onChange={(e) =>
                        handleBonusChange(methodId, 'bonus_type', e.target.value)
                      }
                    >
                      <option value="Fix">Fixed Amount</option>
                      <option value="Percentage">Percentage</option>
                    </Select>
                    <Input
                      type="number"
                      value={bonus.bonus}
                      onChange={(e) =>
                        handleBonusChange(methodId, 'bonus', e.target.value)
                      }
                      placeholder="Bonus Amount"
                      min="0"
                    />
                  </BonusField>
                );
              })}
            </BonusGrid>
          )}
        </FormSection>

        <ButtonGroup>
          <Button type="submit" disabled={promotionLoading || paymentLoading || menuLoading}>
            {editingId ? 'Update Promotion' : 'Create Promotion'}
          </Button>
          {editingId && (
            <SecondaryButton type="button" onClick={resetForm}>
              Cancel
            </SecondaryButton>
          )}
        </ButtonGroup>
      </FormCard>

      {promotionLoading && <LoadingMessage>Loading promotions...</LoadingMessage>}
      {promotionError && <ErrorMessage>Failed to load promotions: {promotionError}</ErrorMessage>}

      <PromotionGrid>
        {(promotions || []).map((promotion) => (
          <PromotionCard key={promotion._id}>
            <PromotionImage src={`${baseURL_For_IMG_UPLOAD}s/${promotion.img}`} alt={promotion.title} />
            <CardTitle>{promotion.title}</CardTitle>
            <CardText>
              Game Type:{' '}
              {(menuOptions || []).find((opt) => opt._id?.toString() === promotion.game_type?.toString())?.title || 'N/A'}
            </CardText>
            <CardText>
              Payment Methods:{' '}
              {(promotion.payment_methods || [])
                .map((methodId) =>
                  (depositPaymentMethods || []).find((m) => m._id?.toString() === methodId?.toString())?.methodName || 'Unknown'
                )
                .join(', ')}
            </CardText>
            <CardText>
              Bonuses:{' '}
              {(promotion.promotion_bonuses || [])
                .map((bonus) => {
                  const method = (depositPaymentMethods || []).find(
                    (m) => m._id?.toString() === bonus.payment_method?.toString()
                  );
                  return `${method?.methodName || 'Unknown'}: ${bonus.bonus} (${bonus.bonus_type})`;
                })
                .join(', ')}
            </CardText>
            <ButtonGroup>
              <Button onClick={() => handleEdit(promotion)}>Edit</Button>
              <SecondaryButton onClick={() => handleDelete(promotion._id)}>
                Delete
              </SecondaryButton>
            </ButtonGroup>
          </PromotionCard>
        ))}
      </PromotionGrid>
    </Container>
  );
}