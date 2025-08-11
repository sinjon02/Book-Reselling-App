import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, CheckCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Form schema for shipping address
const checkoutFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z.string().min(5, { message: "ZIP code must be at least 5 characters" }),
  paymentMethod: z.enum(["creditCard", "paypal"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isComplete, setIsComplete] = useState(false);

  // Shipping cost calculation
  const shippingCost = cartTotal >= 35 ? 0 : 4.99;
  const totalCost = cartTotal + shippingCost;

  // Form setup
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "creditCard",
    },
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (shippingAddress: string) => {
      const response = await apiRequest("POST", "/api/orders", { shippingAddress });
      return response.json();
    },
    onSuccess: () => {
      setIsComplete(true);
      clearCart();
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: CheckoutFormValues) => {
    const formattedAddress = `${data.fullName}, ${data.address}, ${data.city}, ${data.state} ${data.zipCode}`;
    placeOrderMutation.mutate(formattedAddress);
  };

  // Order success screen
  if (isComplete) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-serif">Order Complete!</CardTitle>
              <CardDescription>
                Thank you for your purchase. Your order has been successfully placed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order ID:</span>
                  <span>ORD-{Math.floor(10000 + Math.random() * 90000)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>You will receive an order confirmation email shortly</li>
                  <li>Your order will be processed and prepared for shipping</li>
                  <li>You'll receive tracking information once your order ships</li>
                  <li>Typical delivery time is 3-5 business days</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/books">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile">View Order in Your Account</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6 flex items-center gap-1">
          <Link href="/books">
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </Button>

        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent className="flex flex-col items-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some books to your cart before checking out</p>
              <Button asChild>
                <Link href="/books">Browse Books</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="123 Main St, Apt 4B" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="NY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                  <RadioGroupItem value="creditCard" id="creditCard" />
                                  <label htmlFor="creditCard" className="flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <span>Credit Card</span>
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                  <RadioGroupItem value="paypal" id="paypal" />
                                  <label htmlFor="paypal" className="flex items-center">
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7.11 5H16.47C18.83 5 20.29 6.82 19.96 9.15L19.03 15.77C18.76 17.59 17.3 18.94 15.47 18.99H12.4C9.15 18.97 6.35 16.17 6.33 12.92L6.33 12.92V8.97H8.66V12.92C8.67 14.89 10.25 16.47 12.22 16.49L15.06 16.49C15.8 16.47 16.48 15.88 16.62 15.14L17.54 8.59C17.69 7.68 17.03 6.95 16.12 6.95H9.44L7.11 5Z" fill="#009DE2"/>
                                      <path d="M4.53 3H13.89C16.25 3 17.71 4.82 17.38 7.15L16.45 13.77C16.18 15.59 14.72 16.94 12.9 16.99H9.82C6.58 16.97 3.77 14.17 3.75 10.92L3.75 10.92V6.97H6.09V10.92C6.09 12.89 7.67 14.47 9.64 14.49L12.48 14.49C13.22 14.47 13.9 13.88 14.04 13.14L14.96 6.59C15.11 5.68 14.46 4.95 13.54 4.95H6.86L4.53 3Z" fill="#003087"/>
                                    </svg>
                                    <span>PayPal</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm">
                        <p>
                          <strong>Note:</strong> This is a demo checkout. No actual payment will be processed.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img 
                          src={item.book.imageUrl} 
                          alt={item.book.title} 
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.book.title}</p>
                          <p className="text-sm text-gray-500">{item.book.author}</p>
                          <div className="flex justify-between">
                            <span className="text-sm">${item.book.price.toFixed(2)} × {item.quantity}</span>
                            <span className="font-medium">${(item.book.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalCost.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Free shipping notice */}
                  {shippingCost === 0 && (
                    <div className="bg-green-50 p-3 rounded-md text-green-800 text-sm">
                      <p>You qualify for free shipping!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
