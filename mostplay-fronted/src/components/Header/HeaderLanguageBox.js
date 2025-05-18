import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setLanguage, setCountry } from '../../features/theme/themeSlice';

// Import flag images
import bd_flag from '../../assets/bd_flag.png';
import in_flag from '../../assets/in_flag.png';
import pk_flag from '../../assets/pk_flag.png';
import np_flag from '../../assets/np_flag.png';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

// Styled components
const LanguageBoxContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #EBEBEB;
`;

const Title = styled.h2`
  background-color: #163E91;
  color: white;
  text-align: center;
  font-size: 1.3rem;
  padding: 10px;
`;

const CloseIcon = styled(FaTimes)`
  position: absolute;
  top: 15px;
  right: 15px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin: 5px;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  background-color: white;
  transition: all 0.3s ease;
  border: 2px solid ${props => (props.selected ? '#F4B600' : '#e0e0e0')};
  
  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Flag = styled.img`
  width: 35px;
  height: 35px;
  margin-bottom: 8px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Currency = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const LanguageContainer = styled.div`
  width: 100%;
`;

const LanguageButton = styled.button`
  font-size: 10px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  background-color: ${props => (props.selected ? '#F4B600' : 'white')};
  color: ${props => (props.selected ? 'white' : '#333')};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => (props.selected ? '#F4B600' : '#f0f0f0')};
  }
`;

// Language to language code mapping
const languageToCodeMap = {
  English: 'en',
  'বাংলা': 'bd',
  'हिन्दी': 'in',
  'नेपाली': 'np',
};

// Reverse mapping for display
const codeToLanguageMap = {
  en: 'English',
  bd: 'বাংলা',
  in: 'हिन्दी',
  np: 'नेपाली',
};

// Currency to country code mapping
const currencyToCountryMap = {
  INR: 'in',
  BDT: 'bd',
  PKR: 'pk',
  NPR: 'np',
};

// Currency to default language mapping
const currencyToDefaultLanguage = {
  INR: 'हिन्दी',
  BDT: 'বাংলা',
  PKR: 'English',
  NPR: 'नेपाली',
};

export default function HeaderLanguageBox({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { language: currentLang, country: currentCountry } = useSelector(state => state.theme);
  const { language } = useSelector(state => state.theme);

  const options = [
    {
      flag: in_flag,
      currency: '₹ INR',
      languages: ['English', 'हिन्दी'],
      value: 'INR',
    },
    {
      flag: bd_flag,
      currency: '৳ BDT',
      languages: ['বাংলা', 'English'],
      value: 'BDT',
    },
    {
      flag: pk_flag,
      currency: 'Rs PKR',
      languages: ['English'],
      value: 'PKR',
    },
    {
      flag: np_flag,
      currency: 'Rs NPR',
      languages: ['नेपाली', 'English'],
      value: 'NPR',
    },
  ];

  const isMobile = window.innerWidth <= 768;

  const handleLanguageSelect = (language, currency) => {
    const langCode = languageToCodeMap[language] || 'en';
    const countryCode = currencyToCountryMap[currency] || 'en';
    dispatch(setLanguage(langCode)); // Update language in Redux
    dispatch(setCountry(countryCode)); // Update country in Redux

    // Update URL
    const currentPath = location.pathname.split('/').slice(2).join('/') || '';
    navigate(`/${langCode}/${currentPath}`);

    onClose(); // Close the language box
  };

  const handleSelect = (currency) => {
    const countryCode = currencyToCountryMap[currency] || 'en';
    const defaultLang = currencyToDefaultLanguage[currency] || 'English';
    const langCode = languageToCodeMap[defaultLang] || 'en';
    dispatch(setCountry(countryCode)); // Update country in Redux
    dispatch(setLanguage(langCode)); // Update language to default for currency

    // Update URL
    const currentPath = location.pathname.split('/').slice(2).join('/') || '';
    navigate(`/${langCode}/${currentPath}`);

    onClose();
  };

  return (
    <LanguageBoxContainer>
      <Title>
        {language === 'bd' ? 'কারেন্সি এবং ভাষা' : language === 'in' ? 'मुद्रा और भाषा' : language === 'np' ? 'करन्सी र भाषा' : language === 'en' ? 'Currency and Language' : 'کرنسی اور زبان'}
        <CloseIcon onClick={onClose} />
      </Title>
      <Grid>
        {options.map((option) => (
          <Option
            key={option.value}
            selected={currentCountry === currencyToCountryMap[option.value]}
            onClick={() => handleSelect(option.value)}
          >
            <Flag src={`${baseURL_For_IMG_UPLOAD}s/${option.flag}`} alt={`${option.value} flag`} />
            <Currency>{option.currency}</Currency>
            <LanguageContainer className="row m-0 p-0 d-flex justify-content-center">
              {option.languages.map((lang, index) => (
                <LanguageButton
                  className={`col-4 ${isMobile ? 'col-6' : ''} ${isMobile ? '' : 'ms-1'}`}
                  key={index}
                  selected={
                    codeToLanguageMap[currentLang] === lang &&
                    currentCountry === currencyToCountryMap[option.value]
                  } // Highlight only if both language and country match
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering currency selection
                    handleLanguageSelect(lang, option.value);
                  }}
                >
                  {lang}
                </LanguageButton>
              ))}
            </LanguageContainer>
          </Option>
        ))}
      </Grid>
    </LanguageBoxContainer>
  );
}