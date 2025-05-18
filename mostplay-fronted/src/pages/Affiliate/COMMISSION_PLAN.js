import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import commission_image from "../../assets/COMMISSION_PLAN_image.png"

const CommissionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* // background: #0d2a55;
  //padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white; */
`;

const Title = styled.div`
  background-color: #1D4AA6;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  border-radius: 20px 20px 0 0;
  font-weight: bold;
  text-align: center;
`;

const PlanWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const PlanItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  /* // background: linear-gradient(to bottom, #f1c40f, #0d2a55);
  // padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white; */
  min-width: 180px;
`;

const Icon = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Bar = styled.div`
  height: 5px;
  width: 100%;
  margin: 0 10px;
  background-color: ${({ color }) => color};
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) {
    width: 100px;
  }

`;




export default function CommissionPlan() {

    const primaryColor = useSelector((state) => state.theme.primaryColor);
    const secondaryColor = useSelector((state) => state.theme.secondaryColor);




  return (
    <CommissionContainer className="mt-4 pt-4">
      <Title>  <div className="mt-5 d-flex align-items-center justify-content-center">
      <Bar color={"#0272EF"} />
      <span className="mx-2" style={{ fontSize: '25px' }}>কমিশন পরিকল্পনা</span>
      <Bar color={secondaryColor} />
    </div></Title>
      <PlanWrapper className="row px-3">
        <PlanItem>
          <img src={commission_image} alt="commission" width="100%" />
        </PlanItem>
      </PlanWrapper>
    </CommissionContainer>
  );
}

