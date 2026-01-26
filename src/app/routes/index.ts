import express from "express";

import { authRoutes } from "../modules/Auth/auth.routes";
import { userRoute } from "../modules/User/user.route";
import { privacyPolicyRoute } from "../modules/Privacy_Policy/policy.route";
import { settingRoute } from "../modules/Setting/setting.route";
import { termsConditionRoute } from "../modules/Terms_Condition/terms.route";
import { phoneRoute } from "../modules/Setting/PhoneNumberVerify/phone.route";
import { paymentRoutes } from "../modules/Payment/payment.route";
import { financeRoutes } from "../modules/Finances/finance.route";
import { supportRoutes } from "../modules/Support/support.route";
import { humanRightRoute } from "../modules/Human_Rights/humanRight.route";
import { refundPolicyRoute } from "../modules/Refund_Policy/refund_policy.route";
import { newsRoomRoute } from "../modules/NewsRoom/news_room.route";
import { advertisingRoutes } from "../modules/Advertise/advertising.route";
import { cancelReservationRoute } from "../modules/Cancel_Reservation/cancel_reservation.route";
import { faqRoutes } from "../modules/Faq/faq.routre";
import { messageRoutes } from "../modules/Message/message.route";
import { investorRelationsRoutes } from "../modules/Investor_Relations/investor.route";
import { notificationsRoute } from "../modules/Notification/notification.route";
import { tripServiceRoutes } from "../modules/Trip_Service/tripService.route";
import { vehicleRoutes } from "../modules/Vehicle/vehicle.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoutes,
  },

  {
    path: "/trip-services",
    route: tripServiceRoutes,
  },

  {
    path: "/vehicles",
    route: vehicleRoutes,
  },

  {
    path: "/notifications",
    route: notificationsRoute,
  },
  {
    path: "/faqs",
    route: faqRoutes,
  },
  {
    path: "/news-rooms",
    route: newsRoomRoute,
  },
  {
    path: "/human-rights",
    route: humanRightRoute,
  },
  {
    path: "/cancel-reservations",
    route: cancelReservationRoute,
  },
  {
    path: "/refund-policies",
    route: refundPolicyRoute,
  },
  {
    path: "/terms-conditions",
    route: termsConditionRoute,
  },
  {
    path: "/policy",
    route: privacyPolicyRoute,
  },
  {
    path: "/investor-relations",
    route: investorRelationsRoutes,
  },
  {
    path: "/advertises",
    route: advertisingRoutes,
  },
  // {
  //   path: "/rewards",
  //   route: rewardsRoute,
  // },
  {
    path: "/settings",
    route: settingRoute,
  },
  {
    path: "/phone",
    route: phoneRoute,
  },
  {
    path: "/messages",
    route: messageRoutes,
  },
  {
    path: "/payments",
    route: paymentRoutes,
  },
  {
    path: "/finances",
    route: financeRoutes,
  },
  {
    path: "/supports",
    route: supportRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
