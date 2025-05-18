import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Bar = styled.div`
  height: 5px;
  width: 150px;
  margin: 0 10px;
  background-color: ${({ color }) => color};
  border-radius: 10px;

`;

const Description = styled.p`
  font-size: 18px;
  text-align: justify;
  text-align: center;
`;

export default function Affiliate_des() {
  const primaryColor = useSelector((state) => state.theme.primaryColor);
  const secondaryColor = useSelector((state) => state.theme.secondaryColor);

  return (
    <>
      <div className="mt-5 d-flex align-items-center justify-content-center">
        <Bar color={primaryColor} />
        <span className="mx-2" style={{ fontSize: '25px' }}>ভুমিকা</span>
        <Bar color={secondaryColor} />
      </div>
      <div className="text-center my-3">
        <Description>
        মোস্টপ্লে হলো সর্বোত্তম অনলাইন ক্যাসিনো শুধুমাত্র ভারত, বাংলাদেশ, পাকিস্তানের খেলোয়াড়দের জন্য। ভারত, বাংলাদেশ এবং পাকিস্তানের উপর আমাদের মূল ফোকাস সহ, মোস্টপ্লে বিভিন্ন জনপ্রিয় অনলাইন ক্যাসিনো গেম এবং স্পোর্টস বেটিং প্ল্যাটফর্ম অফার করে।
        </Description>
        <Description>
        মোস্টপ্লে অ্যাফিলিয়েট প্রোগ্রামে ব্যবহারকারী-বান্ধব ইন্টারফেস এবং পেশাদার অ্যাফিলিয়েট ম্যানেজার রয়েছে। এটি আমাদের সহযোগীদের এবং তাদের ডাউনলাইন সদস্যদের সহজে নিয়োগ বাড়াতে সাহায্য করবে।
        </Description>
      </div>
    </>
  );
}

