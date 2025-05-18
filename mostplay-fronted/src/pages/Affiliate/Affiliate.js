import React from 'react'
import styled from 'styled-components'
import AffiliateHeader from './AffiliateHeader';
import AffiliateBanner from './AffiliateBanner';
import Affiliate_des from './Affiliate_des';
import Affiliate_product from './Affiliate_product';
import Affiliate_REGISTRATION from './Affiliate_REGISTRATION';
import Affiliate_BENEFITS from './Affiliate_BENEFITS';
import COMMISSION_PLAN from './COMMISSION_PLAN';
import Affiliate_footer from './Affiliate_footer';

const StyledAffiliate = styled.div`
  background-color: #0E2749;
  color: white;
  padding: 0.8rem 1.5rem;
  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`

export default function Affiliate() {
  return (
    <>
    <AffiliateHeader />
    <AffiliateBanner />


    <StyledAffiliate>
    <Affiliate_des />
    <Affiliate_product />
    <COMMISSION_PLAN />
    <Affiliate_REGISTRATION />
    <Affiliate_BENEFITS />
    </StyledAffiliate>

    <Affiliate_footer />
    </>

  )
}



/**
 *     <StyledAffiliate>
<Affiliate_des />
<Affiliate_product />
<COMMISSION_PLAN />
<Affiliate_REGISTRATION />
<Affiliate_BENEFITS />
</StyledAffiliate>
 */