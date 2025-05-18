import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import product_image from "../../assets/affiliate_product_image_1.png";

const Bar = styled.div`
  height: 5px;
  width: 150px;
  margin: 0 10px;
  background-color: ${({ color }) => color};
  border-radius: 10px;
`;

const Col = styled.div`
  background-color: #1A304E;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  margin: 5px;
`;

const Image = styled.img`
  height: 100px;
  width: auto;
`;

export default function Affiliate_product() {
  const primaryColor = useSelector((state) => state.theme.primaryColor);
  const secondaryColor = useSelector((state) => state.theme.secondaryColor);

  const products = [
    { id: 1, name: 'ফিশিং গেমস', image: product_image },
    { id: 2, name: 'ফিশিং গেমস', image: product_image },
    { id: 3, name: 'ফিশিং গেমস', image: product_image },
    { id: 4, name: 'ফিশিং গেমস', image: product_image },
  ];

  return (
    <>
      <div className="mt-5 d-flex align-items-center justify-content-center">
        <Bar color={primaryColor} />
        <span className="mx-2" style={{ fontSize: '25px' }}>পণ্য</span>
        <Bar color={secondaryColor} />
      </div>
      <div className="mt-3 row p-0 m-0 d-flex justify-content-center">
        {products.map((product) => (
          <div className="col-6 col-md-3 col-lg-3 p-0 m-0" key={product.id}>
            <Col>
              <Image src={product.image} alt="product" />
              <p className="text-white">{product.name}</p>
            </Col>
          </div>
        ))}
      </div>
    </>
  );
}

