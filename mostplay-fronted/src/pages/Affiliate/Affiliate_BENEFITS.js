import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';


const CustomContainer = styled.div`
  background-color: #FFFFFF;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
 
`;


const Bar = styled.div`
  height: 5px;
  width: 150px;
  margin: 0 10px;
  background-color: ${({ color }) => color};
  border-radius: 10px;
`;

const Col = styled.div`
  // background-color: #1A304E;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  margin: 5px;

`;



export default function Affiliate_BENEFITS() {
  const primaryColor = useSelector((state) => state.theme.primaryColor);
  const secondaryColor = useSelector((state) => state.theme.secondaryColor);

  const products = [
    { id: 1, name: 'রেজিস্ট্রেশন ফর্ম',  des : "মোস্টপ্লে পার্টনারের জন্য আবেদনকারীদের আবেদন করতে হলে অবশ্যই রেজিস্ট্রেশন ফর্ম পূরণ করতে হবে। রেজিস্টার বাটনে ক্লিক করুন এবং রেজিস্ট্রেশন ফর্মটি পূরণ করুন৷ প্রদত্ত তথ্য সঠিক হতে হবে।" },
    { id: 2, name: "অনুমোদনের অপেক্ষায়", des :"মোস্টপ্লে পার্টনার আবেদনকারীরা রেজিস্ট্রেশন ফর্ম পূরণ করে জমা দেওয়ার পরে অনুরোধটি পর্যালোচনা করা হবে এবং অ্যাফিলিয়েট ম্যানেজার ২৪ ঘন্টার মধ্যে একটি ইমেল নিশ্চিতকরণ পাঠাবেন ৷" },
    { id: 3, name: 'আয়ের ভাগ', des : "উপার্জনের ভাগ প্রতি মাসে নিবন্ধনের পরে জমা দেওয়া মোস্টপ্লে অংশীদার অ্যাকাউন্টে স্থানান্তরিত হয়।"},
    
  ];

  return (
    <CustomContainer>
      <div className="mt-5 d-flex align-items-center justify-content-center">
        <Bar color={primaryColor} />
        <span className="mx-2" style={{ fontSize: '25px',color:"black" ,textAlign:"center" }}>মোস্টপ্লে পার্টনারদের সুবিধা</span>
        <Bar color={secondaryColor} />
      </div>
      <div className="mt-3 row p-0 m-0 d-flex justify-content-center">
        {products.map((product) => (
          <div className="col-12 col-md-3 col-lg-3 p-0 m-0" key={product.id}>
            <Col>
            
              <p style={{color: primaryColor , textAlign:"center"}} className="mt-2 text-center align-items-center">{product.name}</p>
              <p className=" mt-2" style={{ color:"black" }}>{product.des}</p>
            </Col>
          </div>
        ))}
      </div>
    </CustomContainer>
  );
}


