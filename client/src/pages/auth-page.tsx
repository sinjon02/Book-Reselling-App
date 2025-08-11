import { useState, useEffect } from "react";
import { useAuth, registerSchema } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BookOpen, Loader2, CheckCircle, UserCircle, Mail, Lock, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 10, delay: 0.1 }
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const formItemsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side (Auth forms) */}
      <motion.div 
        className="md:w-1/2 flex items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="mb-2 flex justify-center"
              variants={logoVariants}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-600 rounded-full blur opacity-30"></div>
                <div className="relative bg-white rounded-full p-3 shadow-sm">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-serif">Welcome to BookHaven</CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Sign in to your account or create a new one
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-gray-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <motion.form 
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)} 
                    className="space-y-4"
                    variants={formItemsContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  placeholder="Enter your username" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  type="password" 
                                  placeholder="Enter your password" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <motion.form 
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)} 
                    className="space-y-4"
                    variants={formItemsContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  placeholder="Choose a username" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  type="password" 
                                  placeholder="Create a password" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input 
                                  type="password" 
                                  placeholder="Confirm your password" 
                                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <motion.div 
              className="text-sm text-gray-500 text-center"
              variants={fadeIn}
            >
              {activeTab === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0 h-auto text-primary font-medium" onClick={() => setActiveTab("register")}>
                    Register
                  </Button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 h-auto text-primary font-medium" onClick={() => setActiveTab("login")}>
                    Sign In
                  </Button>
                </p>
              )}
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Right side (Hero) */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-700 p-10 flex-col justify-center items-center text-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-md relative z-10">
          <motion.h1 
            className="text-4xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
            variants={itemVariants}
          >
            Discover Your Next Favorite Book
          </motion.h1>
          
          <motion.p 
            className="text-lg mb-8 text-white/90"
            variants={itemVariants}
          >
            Join our community of book lovers to buy and sell pre-loved books. Save money, reduce waste, and connect with fellow readers.
          </motion.p>
          
          <div className="space-y-5">
            <motion.div 
              className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className="bg-white/20 p-2 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Thousands of Books</h3>
                <p className="text-white/70">Browse our extensive collection across all genres</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className="bg-white/20 p-2 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Great Deals</h3>
                <p className="text-white/70">Save up to 70% compared to buying new</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className="bg-white/20 p-2 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9H15.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Eco-Friendly</h3>
                <p className="text-white/70">Give books a second life and reduce environmental impact</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
}
