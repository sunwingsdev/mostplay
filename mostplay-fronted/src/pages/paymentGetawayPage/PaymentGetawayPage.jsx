import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCopy, FaQuestionCircle, FaCheckCircle, FaSpinner, FaTrash, FaUpload } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

// Styled Components
const PageContainer = styled.div`
  background: linear-gradient(to bottom, #f0f6d2, #f4e5e5);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  font-family: 'Roboto', sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 80rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 4rem;
  }
`;

const FormSection = styled.div`
  background: ${(props) => props.backgroundColor || 'rgba(255, 255, 255, 0.7)'};
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 100px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 1.25rem;
`;

const InstructionText = styled.p`
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  color: rgba(0, 0, 0, 0.8);
`;

const Divider = styled.hr`
  border: 1px dotted ${(props) => props.color || '#f472b6'};
  margin-bottom: 1.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.9);
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 0.5rem;
  border: ${(props) => (props.error ? `1px solid ${props.color || '#f472b6'}` : '1px solid #d1d5db')};
  background: ${(props) => (props.readOnly ? '#f3f4f6' : '#ffffff')};
  padding: 0.5rem 2.75rem 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #374151;
  &:focus {
    outline: none;
    ring: 3px dashed ${(props) => props.color || '#f472b6'};
  }
`;

const FileInput = styled.input`
  width: 100%;
  border-radius: 0.5rem;
  border: ${(props) => (props.error ? `1px solid ${props.color || '#f472b6'}` : '1px solid #d1d5db')};
  background: #ffffff;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  &:focus {
    outline: none;
    ring: 3px dashed ${(props) => props.color || '#f472b6'};
  }
`;

const CopyButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.color || '#f472b6'};
  font-size: 1.1rem;
  border: none;
  background: none;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.hoverColor || '#ec4899'};
  }
`;

const QuestionIcon = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.color || '#f472b6'};
  cursor: pointer;
  font-size: 1.1rem;
  background: none;
  border: none;
  &:hover {
    color: ${(props) => props.hoverColor || '#ec4899'};
  }
`;

const ActionButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: ${(props) => props.bgColor || '#f472b6'};
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${(props) => props.hoverBgColor || '#ec4899'};
  }
`;

const ErrorText = styled.p`
  font-size: 0.7rem;
  color: #dc2626;
  margin-top: 0.2rem;
`;

const StatusText = styled.p`
  font-size: 0.8rem;
  color: #15803d;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  margin-top: 0.75rem;
  width: 100%;
  background: ${(props) => (props.disabled ? '#d1d5db' : props.buttonColor || 'linear-gradient(to bottom, #f472b6, #fb7185)')};
  color: white;
  border-radius: 9999px;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover {
    background: ${(props) =>
      props.disabled ? '#d1d5db' : props.buttonHoverColor || 'linear-gradient(to bottom, #ec4899, #f43f5e)'};
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 28rem;
  gap: 2rem;
`;

const TimerCard = styled.div`
  background: ${(props) => props.buttonColor || 'linear-gradient(to bottom, #f472b6, #fb7185)'};
  border-radius: 0.75rem;
  width: 100%;
  max-width: 28rem;
  text-align: center;
  padding: 1rem;
  color: white;
  font-weight: 500;
`;

const TimerText = styled.p`
  font-size: 40px;
  font-weight: 600;
`;

const TimerLabel = styled.p`
  font-size: 30px;
  font-weight: 400;
`;

const TimerNote = styled.p`
  font-size: 20px;
  font-weight: 400;
  margin-top: 0.15rem;
`;

const Illustration = styled.img`
  width: 100%;
  max-width: 28rem;
  object-fit: contain;
`;

const ErrorMessage = styled.div`
  font-size: 0.9rem;
  color: #dc2626;
  background-color: #fef2f2;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  font-size: 0.9rem;
  color: #15803d;
  background-color: #f0fdf4;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: fadeIn 0.5s ease-in;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: #1f2937;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes fadeOut {
    to { opacity: 0; }
  }
`;

const Spinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Utility to strip HTML tags
const stripHtml = (html) => {
  return html.replace(/<[^>]+>/g, '');
};

// Utility to format seconds into MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Image upload function
const handleImageUpload = async (file) => {
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
};

export default function PaymentGetawayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state || {};
  const paymentMethod = paymentDetails.paymentMethod || {};
  const userInputs = paymentMethod.userInputs || [];

  // Form state
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Timer state
  const [seconds, setSeconds] = useState(1200); // 20 minutes

  // Redirect if paymentDetails is missing
  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  // Initialize form data
  useEffect(() => {
    const initialFormData = {};
    userInputs.forEach((input) => {
      initialFormData[input.name] = '';
    });
    setFormData(initialFormData);
  }, [userInputs]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFileChange = async (name, file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Please upload a PNG, JPEG, or JPG image',
      }));
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await handleImageUpload(file);
      handleInputChange(name, imageUrl);
      setToastMessage('Image uploaded successfully!');
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error.message || 'Failed to upload image',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (name) => {
    setFormData((prev) => ({ ...prev, [name]: '' }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setToastMessage('Image removed successfully!');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Copied to clipboard!');
  };

  const handleShowInstruction = (input) => {
    const instruction = input.fieldInstruction || 'No instruction provided';
    const instructionBD = input.fieldInstructionBD || 'কোন নির্দেশনা প্রদান করা হয়নি';
    setToastMessage(`${instruction}\n${instructionBD}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form
    const newErrors = {};
    userInputs.forEach((input) => {
      if (input.isRequired === 'true' && !formData[input.name]) {
        newErrors[input.name] = `${input.label} is required`;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      setErrorMessage('Please fill in all required fields');
      return;
    }

    // Prepare payload
    const payload = {
      userId: paymentDetails.userInfo._id,
      paymentMethodId: paymentMethod._id,
      channel: paymentDetails.channel || '',
      amount: paymentDetails.amount,
      promotionId: paymentDetails.promotion?._id || null,
      userInputs: userInputs.map((input) => ({
        name: input.name,
        value: formData[input.name],
        label: input.label,
        labelBD: input.labelBD,
        type: input.type,
      })),
    };

    try {
      const response = await fetch(`${baseURL}/payment-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed, e.g., Authorization: Bearer <token>
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message === 'Invalid promotion ID' || data.message.includes('promotion')
            ? 'Selected promotion is invalid or not available. Please try again or proceed without a promotion.'
            : data.message || 'Failed to submit payment transaction'
        );
      }

      // Show success message for 2 seconds before redirecting
      setSuccessMessage('Payment transaction submitted successfully!');
      setIsLoading(false);
      setTimeout(() => {
        navigate('/payment-confirmation', { state: { transactionId: data.data._id } });
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while submitting the payment');
      setIsLoading(false);
    }
  };

  // Simplify instructions by stripping HTML
  const instruction = stripHtml(
    paymentMethod.instruction || 'Cash Out to the account below and fill in the required information'
  );
  const instructionBD = stripHtml(
    paymentMethod.instructionBD || 'নিচের অ্যাকাউন্টে অর্থ প্রেস করুন এবং প্রয়োজনীয় তথ্য পূরণ করুন।'
  );

  // Dynamic colors
  const primaryColor = paymentMethod.color || '#f472b6';
  const buttonColor = paymentMethod.buttonColor
    ? `linear-gradient(to bottom, ${paymentMethod.buttonColor}, ${paymentMethod.buttonColor}80)`
    : 'linear-gradient(to bottom, #f472b6, #fb7185)';
  const buttonHoverColor = paymentMethod.buttonColor
    ? `linear-gradient(to bottom, ${paymentMethod.buttonColor}cc, ${paymentMethod.buttonColor}40)`
    : 'linear-gradient(to bottom, #ec4899, #f43f5e)';
  const backgroundColor = paymentMethod.backgroundColor || 'rgba(255, 255, 255, 0.7)';

  return (
    <PageContainer>
      {toastMessage && (
        <Toast>
          <FaCheckCircle />
          {toastMessage}
        </Toast>
      )}
      <ContentWrapper>
        <FormSection backgroundColor={backgroundColor}>
          <Logo
            src={
              `${baseURL_For_IMG_UPLOAD}s/${paymentMethod.methodImage}` ||
              'https://storage.googleapis.com/a1aa/image/640579da-44ed-43a0-2ece-133abecfb382.jpg'
            }
            alt={`${paymentMethod.methodName || 'Payment'} logo`}
          />
          <InstructionText>
            {instruction}
            <br />
            {instructionBD}
          </InstructionText>
          <Divider color={primaryColor} />
          {errorMessage && (
            <ErrorMessage>
              <FaSpinner style={{ animation: 'none' }} />
              {errorMessage}
            </ErrorMessage>
          )}
          {successMessage && (
            <SuccessMessage>
              <FaCheckCircle />
              {successMessage}
            </SuccessMessage>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Static Amount Field */}
            <Label htmlFor="amount">
              Amount ৳ <span>(পরিমাণ)</span>
            </Label>
            <InputWrapper>
              <Input
                id="amount"
                type="text"
                value={paymentDetails.amount || '0.00'}
                readOnly
                color={primaryColor}
              />
              <CopyButton
                type="button"
                aria-label="Copy amount"
                onClick={() => handleCopy(paymentDetails.amount || '0.00')}
                color={primaryColor}
                hoverColor={primaryColor + 'cc'}
              >
                <FaCopy />
              </CopyButton>
            </InputWrapper>
            <Label htmlFor="agentWallet">
              {paymentMethod.agentWalletText || 'Agent Wallet'}
            </Label>
            <InputWrapper>
              <Input
                id="agentWallet"
                type="text"
                value={paymentMethod.agentWalletNumber || 'XXXXX'}
                readOnly
                color={primaryColor}
              />
              <CopyButton
                type="button"
                aria-label="Copy agent wallet number"
                onClick={() => handleCopy(paymentMethod.agentWalletNumber || 'XXXXX')}
                color={primaryColor}
                hoverColor={primaryColor + 'cc'}
              >
                <FaCopy />
              </CopyButton>
            </InputWrapper>

            {/* Dynamic User Input Fields */}
            {userInputs.map((input) => (
              <div key={input.name}>
                <Label htmlFor={input.name}>
                  {input.label} <span>({input.labelBD})</span>
                  {input.isRequired === 'true' && <span style={{ color: '#dc2626' }}>*</span>}
                </Label>
                <InputWrapper>
                  {input.type === 'file' ? (
                    <>
                      <FileInput
                        id={input.name}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handleFileChange(input.name, e.target.files[0])}
                        error={!!errors[input.name]}
                        color={primaryColor}
                      />
                      {formData[input.name] && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                          <StatusText>Image uploaded</StatusText>
                          <ActionButton
                            type="button"
                            bgColor="#f472b6"
                            hoverBgColor="#ec4899"
                            onClick={() => document.getElementById(input.name).click()}
                          >
                            <FaUpload /> Change
                          </ActionButton>
                          <ActionButton
                            type="button"
                            bgColor="#dc2626"
                            hoverBgColor="#b91c1c"
                            onClick={() => handleDeleteImage(input.name)}
                          >
                            <FaTrash /> Delete
                          </ActionButton>
                        </div>
                      )}
                    </>
                  ) : (
                    <Input
                      id={input.name}
                      type={input.type}
                      placeholder={input.fieldInstruction || input.fieldInstructionBD}
                      value={formData[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      error={!!errors[input.name]}
                      color={primaryColor}
                    />
                  )}
                  {input.type === 'number' && (
                    <CopyButton
                      type="button"
                      aria-label={`Copy ${input.label}`}
                      onClick={() => handleCopy(formData[input.name] || '')}
                      color={primaryColor}
                      hoverColor={primaryColor + 'cc'}
                    >
                      <FaCopy />
                    </CopyButton>
                  )}
                  {input.type !== 'file' && (
                    <QuestionIcon
                      type="button"
                      aria-label={`Show instructions for ${input.label}`}
                      onClick={() => handleShowInstruction(input)}
                      color={primaryColor}
                      hoverColor={primaryColor + 'cc'}
                    >
                      <FaQuestionCircle />
                    </QuestionIcon>
                  )}
                </InputWrapper>
                {errors[input.name] && <ErrorText>{errors[input.name]}</ErrorText>}
              </div>
            ))}

            <SubmitButton
              type="submit"
              buttonColor={buttonColor}
              buttonHoverColor={buttonHoverColor}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                'সার্বমিট করুন'
              )}
            </SubmitButton>
          </Form>
        </FormSection>

        <RightSection>
          <TimerCard buttonColor={buttonColor}>
            <TimerText>{formatTime(seconds)}</TimerText>
            <TimerLabel>Time Remaining</TimerLabel>
            <TimerNote>(এই সময়ের মধ্যে সম্পন্ন করুন)</TimerNote>
          </TimerCard>
          <Illustration
            src={
              `${baseURL_For_IMG_UPLOAD}s/${paymentMethod.paymentPageImage}` ||
              'https://storage.googleapis.com/a1aa/image/24826150-5d0d-42c3-23a6-82ad638b49e5.jpg'
            }
            alt={`${paymentMethod.methodName || 'Payment'} illustration`}
          />
        </RightSection>
      </ContentWrapper>
    </PageContainer>
  );
}