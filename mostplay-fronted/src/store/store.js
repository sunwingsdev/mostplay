import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";
import carouselControlReducer from '../features/carousel/CarouselControlSlice';
import noticeControlReducer from '../features/notice/NoticeControlSlice';
import homeGameMenuReducer from '../features/home-game-menu/GameHomeMenuSliceAndThunks';
import gameSectionReducer from '../features/GamePage/GamePageSliceAndThunk';
import promotionSliceReducer from '../features/promotion/promotionThunkAndSlice';
import depositPaymentGatewayReducer from '../features/depositPaymentMethod/depositPaymentMethodThunkAndSlice';
import withdrawPaymentGatewayReducer from '../features/withdrawPaymentMethod/withdrawPaymentMethodThunkAndSlice';
import transactionReducer from '../features/transaction/transactionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    homePageCarousel: carouselControlReducer,
    noticeControl: noticeControlReducer,
    homeGameMenu: homeGameMenuReducer,
    gameSection: gameSectionReducer,
    promotionSlice: promotionSliceReducer,
    depositPaymentGateway: depositPaymentGatewayReducer,
    withdrawPaymentGateway: withdrawPaymentGatewayReducer,
    transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;