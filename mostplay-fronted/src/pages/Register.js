import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaTimes, FaEye } from "react-icons/fa";
import logo from "../assets/logo.png";
import { signupUser } from "../features/auth/authThunks";
import HomePageSlider from './../components/HomePageSlider';
import { clearError } from "../features/auth/authSlice";
import useLangPath from "../hooks/useLangPath";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #EFEFF0;
  padding-bottom: 100px;

  .error {
    color: red;
    font-size: 0.75rem;
    position: absolute;
    bottom: -25px;
    margin-top: 0.25rem;
  }
  @media (min-width: 769px) {
    padding-top: 50px;
  }
  @media (max-width: 768px) {
    padding-top: 0;
  }
`;

const TopBar = styled.div`
  background-color: #194298;
  color: white;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;

  @media (min-width: 768px) {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
`;

const CloseIcon = styled(FaTimes)`
  cursor: pointer;
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  flex: 1;
  background-color: white;
  padding-bottom: 2rem;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  margin: 10px;
`;

const Label = styled.label`
  text-align: left;
  font-size: 0.875rem;
  color: #000;
  margin-bottom: 0.25rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #F2F2F2;
  ${props =>
    props.error &&
    `
      border-color: red;
    `}
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #F2F2F2;
  margin-bottom: 1rem;
`;

const ClearIcon = styled(FaTimes)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.875rem;
`;

const EyeIcon = styled(FaEye)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.875rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: not-allowed;
  &:not(:disabled) {
    background-color: #3b82f6;
    cursor: pointer;
    &:hover {
      background-color: #2563eb;
    }
  }
`;

const SignUpLink = styled.p`
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: #000;
  a {
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
`;


const RegisterSliderContainer = styled.div`
  padding: 0px;
  /* @media (min-width: 769px) {
    padding: 0 200px;
  } */


`;



const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;



export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState("INR"); // Default currency
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const langPath = useLangPath();
  const { loading, error , isAuthenticated } = useSelector((state) => state.auth);

  const location = useLocation();
const from = location.state?.from?.pathname || "/";


useEffect(() => {

  console.log("this is --->> ",from);
  

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }
}, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      // Reset the error state when the component unmounts
      dispatch({ type: 'auth/clearError' });
    };
  }, [dispatch]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();


    let country = "";
    if (currency === "BDT") country = "Bangladesh";
    else if (currency === "INR") country = "India";
    else if (currency === "PKR") country = "Pakistan";
    else if (currency === "NPR") country = "Nepal";
    
    
    // Validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setValidationError("ব্যবহারকারীর ইমেইল সঠিক নয়।");
      return;
    }
    if (name.length < 4 || name.length > 15) {
      setValidationError("ব্যবহারকারীর নাম ৪-১৫ অক্ষর হতে হবে।");
      return;
    }
    if (password.length < 6 || password.length > 20) {
      setValidationError("পাসওয়ার্ড ৬-২০ অক্ষর বা সংখ্যা হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("পাসওয়ার্ড মিলছে না।");
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      setValidationError("ফোন নম্বর ১০-১৫ সংখ্যার হতে হবে।");
      return;
    }




    setValidationError("");
    await dispatch(signupUser({ name,email, password, confirmPassword, phoneNumber : phone, currency,country }))
      .unwrap()
      .then(() => {
        navigate(from || "/dashboard", { replace: true }); //  আগের page এ ফিরে যাও
      })
      .catch((err) => {
       setValidationError( err ||"Registration failed")
      });





  };

  const handleClear = (field) => {
    if (field === "email") setEmail("");
    if (field === "name") setName("");
    if (field === "password") setPassword("");
    if (field === "confirmPassword") setConfirmPassword("");
    if (field === "phone") setPhone("");
  };

  return (
    <Container>
      <div>
        <RegisterBox>
          <TopBar>
            <div style={{ flex: 1, textAlign: "center", fontSize: "20px" }}>রেজিস্টার</div>
            <CloseIcon onClick={() => navigate(-1)} />
          </TopBar>



          <div>
            <img src={logo} className="mt-2 pt-5 mb-4" alt="mostplay" width="150px" />

            <RegisterSliderContainer>
            <HomePageSlider />
          </RegisterSliderContainer>

            <Form className="mt-3" onSubmit={handleSubmit}>
            <Label>মুদ্রা নির্বাচন করুন</Label>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="INR">INR (Indian Rupee)</option>
              <option value="BDT">BDT (Bangladeshi Taka)</option>
              <option value="PKR">PKR (Pakistani Rupee)</option>
              <option value="NPR">NPR (Nepalese Rupee)</option>
            </Select>

              <Label>ব্যবহারকারীর নাম</Label>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  error={validationError.includes("ব্যবহারকারীর নাম ৪-১৫ অক্ষর হতে হবে।")}
                />
                {name && <ClearIcon onClick={() => handleClear("name")} />}
              </InputWrapper>

              <Label>ব্যবহারকারীর ইমেইল</Label>
              <InputWrapper>
                <Input
                  type="email"
                  placeholder="ইমেইল"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={validationError.includes("ব্যবহারকারীর ইমেইল সঠিক নয়।")}
                />
                {email && <ClearIcon onClick={() => handleClear("email")} />}
              </InputWrapper>

              <Label>পাসওয়ার্ড</Label>
              <InputWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="৬-২০ অক্ষর বা সংখ্যা"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  error={validationError.includes("পাসওয়ার্ড")}
                />
                {password ? (
                  <ClearIcon onClick={() => handleClear("password")} />
                ) : (
                  <EyeIcon onClick={() => setShowPassword(!showPassword)} />
                )}
              </InputWrapper>

          

              <Label>পাসওয়ার্ড নিশ্চিত করুন</Label>
              <InputWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  error={validationError.includes("মিলছে না")}
                />
                {confirmPassword ? (
                  <ClearIcon onClick={() => handleClear("confirmPassword")} />
                ) : (
                  <EyeIcon onClick={() => setShowPassword(!showPassword)} />
                )}
              </InputWrapper>

              <Label>ফোন নাম্বার</Label>
              <InputWrapper style={{ display: "flex", gap: "10px" }}>
                <Input
                  type="text"
                  value={currency === "INR" ? "+91" : currency === "BDT" ? "+880" : currency === "PKR" ? "+92" : "+977"}
                  disabled
                  style={{ width: "90px" }}
                />
                <Input
                  type="tel"
                  placeholder="আপনার ফোন নম্বর"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  error={validationError.includes("ফোন নম্বর")}
                  style={{ flex: 1 }}
                />
                {phone && <ClearIcon onClick={() => handleClear("phone")} />}
              </InputWrapper>

              {validationError && <ErrorMessage>{validationError}</ErrorMessage>}


              {loading ? <LoadingSpinner /> : <Button type="submit">রেজিস্টার</Button>}

              <SignUpLink>
                ইতিমধ্যে একটি অ্যাকাউন্ট আছে? <Link to={langPath(`login`)} >লগইন</Link>
              </SignUpLink>
            </Form>
          </div>
        </RegisterBox>
      </div>
    </Container>
  );
}



