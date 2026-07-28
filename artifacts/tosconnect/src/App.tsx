import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import MixingMasteringPage from "@/pages/mixing-mastering";
import ConsultationPage from "@/pages/consultation";
import TrackOrderPage from "@/pages/track-order";
import AdminPage from "@/pages/admin";
import CheckoutPage from "@/pages/checkout";
import { OrderConfirmedPage, BookingConfirmedPage } from "@/pages/order-confirmed";

import RefundPolicy from "@/pages/legal/refund-policy";
import DeliveryPolicy from "@/pages/legal/delivery-policy";
import TermsConditions from "@/pages/legal/terms-conditions";
import PrivacyPolicy from "@/pages/legal/privacy-policy";
import CookiePolicy from "@/pages/legal/cookie-policy";
import AmlPolicy from "@/pages/legal/aml-policy";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services/mixing-mastering" component={MixingMasteringPage} />
        <Route path="/services/consultation" component={ConsultationPage} />
        <Route path="/track-order" component={TrackOrderPage} />
        <Route path="/admin" component={AdminPage} />

        {/* Payment flow */}
        <Route path="/checkout/:transactionId" component={CheckoutPage} />
        <Route path="/order-confirmed/order/:orderId" component={OrderConfirmedPage} />
        <Route path="/order-confirmed/booking/:bookingId" component={BookingConfirmedPage} />

        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/delivery-policy" component={DeliveryPolicy} />
        <Route path="/terms-and-conditions" component={TermsConditions} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/aml-policy" component={AmlPolicy} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
