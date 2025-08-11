import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import BooksPage from "@/pages/books-page";
import BookDetailPage from "@/pages/book-detail-page";
import CheckoutPage from "@/pages/checkout-page";
import ProfilePage from "@/pages/profile-page";
import CommunityPage from "@/pages/community-page";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { ProtectedRoute } from "@/lib/protected-route";
import { AnimatePresence, motion } from "framer-motion";
//import { ThemeProvider } from "@/components/ui/theme-provider";

// Page transition animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1], // Cubic bezier for smooth easing
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1],
    }
  }
};

// AnimatedRoute component to handle page transitions
function AnimatedRoute({ component: Component, path }: { component: () => JSX.Element, path: string }) {
  const [location] = useLocation();
  const isActive = location === path || (path !== '/' && location.startsWith(path + '/'));
  
  return isActive ? (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="w-full"
    >
      <Component />
    </motion.div>
  ) : null;
}

// AnimatedProtectedRoute for protected routes with animations
function AnimatedProtectedRoute({ component, path }: { component: () => JSX.Element, path: string }) {
  return <ProtectedRoute path={path} component={() => (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="w-full"
    >
      {component()}
    </motion.div>
  )} />;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/">
          <AnimatedRoute path="/" component={HomePage} />
        </Route>
        <Route path="/auth">
          <AnimatedRoute path="/auth" component={AuthPage} />
        </Route>
        <Route path="/books">
          <AnimatedRoute path="/books" component={BooksPage} />
        </Route>
        <Route path="/books/:id">
          <AnimatedRoute path="/books/:id" component={BookDetailPage} />
        </Route>
        <Route path="/checkout">
          <AnimatedProtectedRoute path="/checkout" component={CheckoutPage} />
        </Route>
        <Route path="/profile">
          <AnimatedProtectedRoute path="/profile" component={ProfilePage} />
        </Route>
        <Route path="/community">
          <AnimatedRoute path="/community" component={CommunityPage} />
        </Route>
        <Route>
          <AnimatedRoute path="404" component={NotFound} />
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
