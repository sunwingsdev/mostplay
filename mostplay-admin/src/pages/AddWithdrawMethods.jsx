import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  getWithdrawPaymentMethods,
  createWithdrawPaymentMethod,
  updateWithdrawPaymentMethod,
  deleteWithdrawPaymentMethod,
  getWithdrawPaymentMethodById,
} from '../redux/Withdraw Control/withdrawPaymentGetawaySliceAndApi.js';
import JoditEditor from 'jodit-react';
import { baseURL_For_IMG_UPLOAD } from '../utils/baseURL.js';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f4f7fa;
  min-height: 100vh;
  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 2rem;
`;

const FormCard = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  direction: ltr;
  &:focus {
    outline: none;
    border-color: #4c51bf;
    box-shadow: 0 0 0 3px rgba(76, 81, 191, 0.1);
  }
  ${({ error }) => error && `border-color: #e53e3e;`}
  ${({ type }) => type === 'color' && `height: 50px;`}
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  direction: ltr;
  &:hover {
    border-color: #4c51bf;
  }
  ${({ error }) => error && `border-color: #e53e3e;`}
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  appearance: none;
  transition: all 0.3s ease;
  direction: ltr;
  &:focus {
    outline: none;
    border-color: #4c51bf;
    box-shadow: 0 0 0 3px rgba(76, 81, 191, 0.1);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  ${({ primary }) =>
    primary
      ? `
        background: linear-gradient(45deg, #4c51bf, #7f9cf5);
        color: white;
        &:hover {
          background: linear-gradient(45deg, #434190, #667eea);
        }
      `
      : `
        background: #edf2f7;
        color: #2d3748;
        &:hover {
          background: #e2e8f0;
        }
      `}
  ${({ danger }) =>
    danger &&
    `
      background: linear-gradient(45deg, #e53e3e, #f56565);
      color: white;
      &:hover {
        background: linear-gradient(45deg, #c53030, #e53e3e);
      }
    `}
  ${({ small }) =>
    small &&
    `
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    `}
  &:disabled {
    background: #e2e8f0;
    cursor W: 0.7;
  }
`;

const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const GatewayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const GatewayTag = styled.div`
  display: flex;
  align-items: center;
  background: #e6fffa;
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
`;

const RemoveGatewayButton = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    color: #c53030;
  }
`;

const GatewayInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  @media (max-width: 640px) {
    margin: 1rem;
  }
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a8a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #2d3748;
  cursor: pointer;
  &:hover {
    color: #e53e3e;
  }
`;

const UserInputCard = styled.div`
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background: linear-gradient(45deg, #4c51bf, #7f9cf5);
  color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  &:hover {
    background: rgba(167, 169, 202, 0.26);
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #2d3748;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MethodCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const MethodImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const AddWithdrawMethods = () => {
  const dispatch = useDispatch();
  const { withdrawPaymentMethods = [], isLoading, error } = useSelector((state) => state.withdrawPaymentGateway || {});

  const [formData, setFormData] = useState({
    methodName: '',
    methodNameBD: '',
    methodImage: '',
    gateway: [],
    color: '#000000',
    backgroundColor: '#ffffff',
    buttonColor: '#000000',
    instruction: '',
    instructionBD: '',
    status: 'active',
    userInputs: [],
  });

  const [newUserInput, setNewUserInput] = useState({
    type: 'text',
    isRequired: 'false',
    label: '',
    labelBD: '',
    fieldInstruction: '',
    fieldInstructionBD: '',
    name: '',
  });
  const [editingUserInput, setEditingUserInput] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [gatewayInput, setGatewayInput] = useState('');
  const [gatewayError, setGatewayError] = useState('');
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const instructionEditorRef = useRef(null);
  const instructionBDEditorRef = useRef(null);

  useEffect(() => {
    dispatch(getWithdrawPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
      console.error('Upload Error:', error);
      throw error;
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.methodName.trim()) newErrors.methodName = 'Method Name is required';
    if (!formData.methodNameBD.trim()) newErrors.methodNameBD = 'Method Name (Bangla) is required';
    if (!formData.methodImage.trim()) newErrors.methodImage = 'Method Image is required';
    if (!formData.color) newErrors.color = 'Text Color is required';
    if (!formData.backgroundColor) newErrors.backgroundColor = 'Background Color is required';
    if (!formData.buttonColor) newErrors.buttonColor = 'Button Color is required';
    if (formData.userInputs.length === 0) {
      newErrors.userInputs = 'At least one user input field is required';
    } else {
      const hasRequiredField = formData.userInputs.some((input) => input.isRequired === 'true');
      if (!hasRequiredField) {
        newErrors.userInputs = 'At least one user input field must be marked as required';
      }
      formData.userInputs.forEach((input, index) => {
        if (!input.name.trim()) {
          newErrors[`userInputs[${index}].name`] = 'Name is required';
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleEditorChange = (newContent, field) => {
    setFormData((prev) => ({ ...prev, [field]: newContent }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      setFormData((prev) => ({ ...prev, [field]: imageUrl }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
      toast.success('Method image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload method image');
    }
  };

  const handleGatewayInputChange = (e) => {
    setGatewayInput(e.target.value);
    setGatewayError('');
  };

  const addGateway = () => {
    const trimmedGateway = gatewayInput.trim();
    if (!trimmedGateway) {
      setGatewayError('Gateway name cannot be empty');
      return;
    }
    if (formData.gateway.includes(trimmedGateway)) {
      setGatewayError('Gateway already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      gateway: [...prev.gateway, trimmedGateway],
    }));
    setGatewayInput('');
    setGatewayError('');
  };

  const removeGateway = (gatewayToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gateway: prev.gateway.filter((gateway) => gateway !== gatewayToRemove),
    }));
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, 'newUserInput.name': '' }));
  };

  const handleEditingUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUserInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, 'editingUserInput.name': '' }));
  };

  const addUserInput = () => {
    if (!newUserInput.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        'newUserInput.name': 'Name is required',
      }));
      toast.error('Please fill in the name for the new user input');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      userInputs: [...prev.userInputs, { ...newUserInput }],
    }));
    setNewUserInput({
      type: 'text',
      isRequired: 'false',
      label: '',
      labelBD: '',
      fieldInstruction: '',
      fieldInstructionBD: '',
      name: '',
    });
    setIsAddModalOpen(false);
    toast.success('User input added successfully');
  };

  const updateUserInput = () => {
    if (!editingUserInput.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        'editingUserInput.name': 'Name is required',
      }));
      toast.error('Please fill in the name for the user input');
      return;
    }
    const updatedUserInputs = [...formData.userInputs];
    updatedUserInputs[editingIndex] = { ...editingUserInput };
    setFormData((prev) => ({
      ...prev,
      userInputs: updatedUserInputs,
    }));
    setEditingUserInput(null);
    setEditingIndex(null);
    setIsUpdateModalOpen(false);
    toast.success('User input updated successfully');
  };

  const deleteUserInput = (index) => {
    setFormData((prev) => ({
      ...prev,
      userInputs: prev.userInputs.filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`userInputs[${index}]`)) delete newErrors[key];
      });
      return newErrors;
    });
    toast.success('User input deleted successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    try {
      if (editingId) {
        await dispatch(updateWithdrawPaymentMethod({ id: editingId, data: formData })).unwrap();
        toast.success('Payment method updated successfully');
      } else {
        await dispatch(createWithdrawPaymentMethod(formData)).unwrap();
        toast.success('Payment method created successfully');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save payment method');
    }
  };

  const handleEdit = async (id) => {
    try {
      const paymentMethod = await dispatch(getWithdrawPaymentMethodById(id)).unwrap();
      setFormData({
        ...paymentMethod,
        instruction: paymentMethod.instruction || '',
        instructionBD: paymentMethod.instructionBD || '',
      });
      setEditingId(id);
      setErrors({});
    } catch (err) {
      toast.error('Failed to fetch payment method');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await dispatch(deleteWithdrawPaymentMethod(id)).unwrap();
        toast.success('Payment method deleted successfully');
      } catch (err) {
        toast.error('Failed to delete payment method');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      methodName: '',
      methodNameBD: '',
      methodImage: '',
      gateway: [],
      color: '#000000',
      backgroundColor: '#ffffff',
      buttonColor: '#000000',
      instruction: '',
      instructionBD: '',
      status: 'active',
      userInputs: [],
    });
    setNewUserInput({
      type: 'text',
      isRequired: 'false',
      label: '',
      labelBD: '',
      fieldInstruction: '',
      fieldInstructionBD: '',
      name: '',
    });
    setEditingUserInput(null);
    setEditingIndex(null);
    setGatewayInput('');
    setGatewayError('');
    setEditingId(null);
    setErrors({});
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const openAddModal = () => {
    setNewUserInput({
      type: 'text',
      isRequired: 'false',
      label: '',
      labelBD: '',
      fieldInstruction: '',
      fieldInstructionBD: '',
      name: '',
    });
    setErrors({});
    setIsAddModalOpen(true);
  };

  const openUpdateModal = (input, index) => {
    setEditingUserInput({ ...input });
    setEditingIndex(index);
    setErrors({});
    setIsUpdateModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);
  const closeUpdateModal = () => {
    setEditingUserInput(null);
    setEditingIndex(null);
    setIsUpdateModalOpen(false);
  };

  return (
    <Container>
      <Title>Manage Withdraw Payment Methods</Title>

      {/* Form */}
      <FormCard onSubmit={handleSubmit}>
        <Grid>
          <InputGroup>
            <Label>Method Name (English)</Label>
            <Input
              type="text"
              name="methodName"
              value={formData.methodName}
              onChange={handleInputChange}
              error={errors.methodName}
            />
            {errors.methodName && <ErrorText>{errors.methodName}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Method Name (Bangla)</Label>
            <Input
              type="text"
              name="methodNameBD"
              value={formData.methodNameBD}
              onChange={handleInputChange}
              error={errors.methodNameBD}
            />
            {errors.methodNameBD && <ErrorText>{errors.methodNameBD}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Method Image</Label>
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'methodImage')}
              error={errors.methodImage}
            />
            {formData.methodImage && <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${formData.methodImage}`} alt="Method Preview" />}
            {errors.methodImage && <ErrorText>{errors.methodImage}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Gateways</Label>
            <GatewayInputWrapper>
              <Input
                type="text"
                value={gatewayInput}
                onChange={handleGatewayInputChange}
                placeholder="Enter gateway name"
                error={gatewayError}
              />
              <Button type="button" onClick={addGateway} small primary>
                Add
              </Button>
            </GatewayInputWrapper>
            {gatewayError && <ErrorText>{gatewayError}</ErrorText>}
            {formData.gateway.length > 0 && (
              <GatewayContainer>
                {formData.gateway.map((gateway, index) => (
                  <GatewayTag key={index}>
                    {gateway}
                    <RemoveGatewayButton onClick={() => removeGateway(gateway)}>×</RemoveGatewayButton>
                  </GatewayTag>
                ))}
              </GatewayContainer>
            )}
          </InputGroup>
          <InputGroup>
            <Label>Text Color</Label>
            <Input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              error={errors.color}
            />
            {errors.color && <ErrorText>{errors.color}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Background Color</Label>
            <Input
              type="color"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleInputChange}
              error={errors.backgroundColor}
            />
            {errors.backgroundColor && <ErrorText>{errors.backgroundColor}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Button Color</Label>
            <Input
              type="color"
              name="buttonColor"
              value={formData.buttonColor}
              onChange={handleInputChange}
              error={errors.buttonColor}
            />
            {errors.buttonColor && <ErrorText>{errors.buttonColor}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Status</Label>
            <Select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </InputGroup>
        </Grid>
        <InputGroup>
          <Label>Instruction (English)</Label>
          <JoditEditor
            ref={instructionEditorRef}
            value={formData.instruction}
            onChange={(newContent) => handleEditorChange(newContent, 'instruction')}
          />
        </InputGroup>
        <InputGroup>
          <Label>Instruction (Bangla)</Label>
          <JoditEditor
            ref={instructionBDEditorRef}
            value={formData.instructionBD}
            onChange={(newContent) => handleEditorChange(newContent, 'instructionBD')}
          />
        </InputGroup>
        <InputGroup>
          <Label>User Input Fields</Label>
          <ButtonWrapper>
            <Button type="button" onClick={openAddModal} primary>
              Add New User Input
            </Button>
          </ButtonWrapper>
          {errors.userInputs && <ErrorText>{errors.userInputs}</ErrorText>}
        </InputGroup>
        {formData.userInputs.length > 0 && (
          <InputGroup>
            <Label>Saved User Inputs</Label>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Label (EN)</TableHeader>
                  <TableHeader>Label (BD)</TableHeader>
                  <TableHeader>Is Required</TableHeader>
                  <TableHeader>Instruction (EN)</TableHeader>
                  <TableHeader>Instruction (BD)</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {formData.userInputs.map((input, index) => (
                  <TableRow key={index}>
                    <TableCell>{input.name || ''}</TableCell>
                    <TableCell>{input.type}</TableCell>
                    <TableCell>{input.label || ''}</TableCell>
                    <TableCell>{input.labelBD || ''}</TableCell>
                    <TableCell>{input.isRequired}</TableCell>
                    <TableCell>{input.fieldInstruction || ''}</TableCell>
                    <TableCell>{input.fieldInstructionBD || ''}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button
                          type="button"
                          onClick={() => openUpdateModal(input, index)}
                          small
                          primary
                        >
                          Update
                        </Button>
                        <Button
                          type="button"
                          onClick={() => deleteUserInput(index)}
                          small
                          danger
                        >
                          Delete
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </InputGroup>
        )}

        <ButtonWrapper>
          <Button type="submit" primary disabled={isLoading}>
            {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </Button>
          {editingId && (
            <Button type="button" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </ButtonWrapper>
      </FormCard>

      {/* Add User Input Modal */}
      {isAddModalOpen && (
        <ModalOverlay onClick={closeAddModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add New User Input</ModalTitle>
              <CloseButton onClick={closeAddModal}>×</CloseButton>
            </ModalHeader>
            <UserInputCard>
              <Grid>
                <InputGroup>
                  <Label>Type</Label>
                  <Select
                    name="type"
                    value={newUserInput.type}
                    onChange={handleNewUserInputChange}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="file">File</option>
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={newUserInput.name}
                    onChange={handleNewUserInputChange}
                    error={errors['newUserInput.name']}
                  />
                  {errors['newUserInput.name'] && (
                    <ErrorText>{errors['newUserInput.name']}</ErrorText>
                  )}
                </InputGroup>
                <InputGroup>
                  <Label>Label (English)</Label>
                  <Input
                    type="text"
                    name="label"
                    value={newUserInput.label}
                    onChange={handleNewUserInputChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Label (Bangla)</Label>
                  <Input
                    type="text"
                    name="labelBD"
                    value={newUserInput.labelBD}
                    onChange={handleNewUserInputChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Is Required</Label>
                  <Select
                    name="isRequired"
                    value={newUserInput.isRequired}
                    onChange={handleNewUserInputChange}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>Field Instruction (English)</Label>
                  <Input
                    type="text"
                    name="fieldInstruction"
                    value={newUserInput.fieldInstruction}
                    onChange={handleNewUserInputChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Field Instruction (Bangla)</Label>
                  <Input
                    type="text"
                    name="fieldInstructionBD"
                    value={newUserInput.fieldInstructionBD}
                    onChange={handleNewUserInputChange}
                  />
                </InputGroup>
              </Grid>
            </UserInputCard>
            <div className="flex gap-4">
              <Button type="button" onClick={addUserInput} primary>
                Add User Input
              </Button>
              <Button type="button" onClick={closeAddModal}>
                Cancel
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Update User Input Modal */}
      {isUpdateModalOpen && editingUserInput && (
        <ModalOverlay onClick={closeUpdateModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Update User Input</ModalTitle>
              <CloseButton onClick={closeUpdateModal}>×</CloseButton>
            </ModalHeader>
            <UserInputCard>
              <Grid>
                <InputGroup>
                  <Label>Type</Label>
                  <Select
                    name="type"
                    value={editingUserInput.type}
                    onChange={handleEditingUserInputChange}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="file">File</option>
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={editingUserInput.name}
                    onChange={handleEditingUserInputChange}
                    error={errors['editingUserInput.name']}
                  />
                  {errors['editingUserInput.name'] && (
                    <ErrorText>{errors['editingUserInput.name']}</ErrorText>
                  )}
                </InputGroup>
                <InputGroup>
                  <Label>Label (English)</Label>
                  <Input
                    type="text"
                    name="label"
                    value={editingUserInput.label}
                    onChange={handleEditingUserInputChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Label (Bangla)</Label>
                  <Input
                    type="text"
                    name="labelBD"
                    value={editingUserInput.labelBD}
                    onChange={handleEditingUserInputChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Is Required</Label>
                  <Select
                    name="isRequired"
                    value={editingUserInput.isRequired}
                    onChange={handleEditingUserInputChange}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>Field Instruction (English)</Label>
                  <Input
                    type="text"
                    name="fieldInstruction"
                    value={editingUserInput.fieldInstruction}
                    onChange={handleEditingUserInputChange}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Field Instruction (Bangla)</Label>
                  <Input
                    type="text"
                    name="fieldInstructionBD"
                    value={editingUserInput.fieldInstructionBD}
                    onChange={handleEditingUserInputChange}
                  />
                </InputGroup>
              </Grid>
            </UserInputCard>
            <div className="flex gap-4">
              <Button type="button" onClick={updateUserInput} primary>
                Save Changes
              </Button>
              <Button type="button" onClick={closeUpdateModal}>
                Cancel
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* THESE ARE THE PAYMENT METHODS LIST */}
      <div>
        <h2 className="text-xl font-medium text-gray-700 mb-4">Payment Methods</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : !withdrawPaymentMethods || withdrawPaymentMethods.length === 0 ? (
          <p className="text-gray-600">No payment methods found.</p>
        ) : (
          <MethodsGrid>
            {withdrawPaymentMethods.map((method) => (
              <MethodCard key={method._id}>
                <MethodImage src={`${baseURL_For_IMG_UPLOAD}s/${method.methodImage}`} alt={method.methodName} />
                <h3 className="text-lg font-medium text-gray-900">{method.methodName}</h3>
                <p className="text-sm text-gray-600">Status: {method.status}</p>
                <p className="text-sm text-gray-600">Gateways: {method.gateway.join(', ')}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    className="text-sm mx-1"
                    onClick={() => handleEdit(method._id)}
                    style={{ background: 'transparent', color: '#2563eb' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Edit
                  </Button>
                  <Button
                    className="text-sm mx-1"
                    onClick={() => handleDelete(method._id)}
                    style={{ background: 'transparent', color: '#dc2626' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Delete
                  </Button>
                </div>
              </MethodCard>
            ))}
          </MethodsGrid>
        )}
      </div>
    </Container>
  );
};
export default AddWithdrawMethods;