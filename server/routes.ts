import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertBookSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  bookCategories,
  bookConditions,
  bookFormats
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Initialize sample data
  await storage.initSampleData();
  
  // BOOK ROUTES
  
  // Get all books with optional filters
  app.get("/api/books", async (req: Request, res: Response) => {
    try {
      const { category, condition, format, minPrice, maxPrice, search } = req.query;
      
      const options = {
        category: category as string,
        condition: condition as string,
        format: format as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        searchTerm: search as string
      };

      const books = await storage.getBooks(options);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });
  
  // Get book by ID
  app.get("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.id, 10);
      const book = await storage.getBook(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book" });
    }
  });
  
  // Create new book (protected route)
  app.post("/api/books", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const bookData = insertBookSchema.parse(req.body);
      const newBook = await storage.createBook({
        ...bookData,
        sellerId: req.user!.id
      });
      
      res.status(201).json(newBook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating book" });
    }
  });
  
  // Update book (protected route)
  app.put("/api/books/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const bookId = parseInt(req.params.id, 10);
      const book = await storage.getBook(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Only the seller can update their book
      if (book.sellerId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedBook = await storage.updateBook(bookId, req.body);
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: "Error updating book" });
    }
  });
  
  // Delete book by ID (protected route)
  app.delete("/api/books/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const bookId = parseInt(req.params.id, 10);
      const book = await storage.getBook(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Only the seller can delete their book
      if (book.sellerId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteBook(bookId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting book" });
    }
  });
  
  // CART ROUTES
  
  // Get user's cart
  app.get("/api/cart", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      
      // Get book details for each cart item
      const cartWithBooks = await Promise.all(
        cartItems.map(async (item) => {
          const book = await storage.getBook(item.bookId);
          return {
            ...item,
            book
          };
        })
      );
      
      res.json(cartWithBooks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  });
  
  // Add item to cart
  app.post("/api/cart", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const cartData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Check if book exists
      const book = await storage.getBook(cartData.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Check if book is in stock
      if (!book.inStock) {
        return res.status(400).json({ message: "Book is out of stock" });
      }
      
      const cartItem = await storage.addCartItem(cartData);
      
      // Get book details to return with cart item
      const cartWithBook = {
        ...cartItem,
        book
      };
      
      res.status(201).json(cartWithBook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding to cart" });
    }
  });
  
  // Update cart item quantity
  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const cartItemId = parseInt(req.params.id, 10);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(cartItemId, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Get book details to return with cart item
      const book = await storage.getBook(cartItem.bookId);
      const cartWithBook = {
        ...cartItem,
        book
      };
      
      res.json(cartWithBook);
    } catch (error) {
      res.status(500).json({ message: "Error updating cart" });
    }
  });
  
  // Remove item from cart
  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const cartItemId = parseInt(req.params.id, 10);
      const success = await storage.removeCartItem(cartItemId);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing from cart" });
    }
  });
  
  // Clear cart
  app.delete("/api/cart", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const success = await storage.clearCart(req.user!.id);
      
      if (!success) {
        return res.status(500).json({ message: "Error clearing cart" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });
  
  // ORDER ROUTES
  
  // Get user's orders
  app.get("/api/orders", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const orders = await storage.getOrders(req.user!.id);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          
          // Get book details for each order item
          const itemsWithBooks = await Promise.all(
            items.map(async (item) => {
              const book = await storage.getBook(item.bookId);
              return {
                ...item,
                book
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithBooks
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  // Get single order
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const orderId = parseInt(req.params.id, 10);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Only the order owner can view it
      if (order.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get order items
      const items = await storage.getOrderItems(orderId);
      
      // Get book details for each order item
      const itemsWithBooks = await Promise.all(
        items.map(async (item) => {
          const book = await storage.getBook(item.bookId);
          return {
            ...item,
            book
          };
        })
      );
      
      const orderWithItems = {
        ...order,
        items: itemsWithBooks
      };
      
      res.json(orderWithItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });
  
  // Create new order (checkout)
  app.post("/api/orders", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { shippingAddress } = req.body;
      
      if (!shippingAddress) {
        return res.status(400).json({ message: "Shipping address is required" });
      }
      
      // Get user's cart
      const cartItems = await storage.getCartItems(req.user!.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total price
      let total = 0;
      const orderItemsData: { bookId: number; quantity: number; price: number }[] = [];
      
      for (const item of cartItems) {
        const book = await storage.getBook(item.bookId);
        
        if (!book) {
          return res.status(400).json({ message: `Book with ID ${item.bookId} not found` });
        }
        
        if (!book.inStock) {
          return res.status(400).json({ message: `Book "${book.title}" is out of stock` });
        }
        
        total += book.price * item.quantity;
        orderItemsData.push({
          bookId: book.id,
          quantity: item.quantity,
          price: book.price
        });
      }
      
      // Create order
      const orderData = insertOrderSchema.parse({
        userId: req.user!.id,
        total,
        shippingAddress,
        status: "Pending"
      });
      
      const newOrder = await storage.createOrder(orderData);
      
      // Create order items
      const orderItems = await Promise.all(
        orderItemsData.map(async (item) => {
          return storage.createOrderItem({
            orderId: newOrder.id,
            ...item
          });
        })
      );
      
      // Clear the cart after successful order
      await storage.clearCart(req.user!.id);
      
      // Get book details for order items
      const itemsWithBooks = await Promise.all(
        orderItems.map(async (item) => {
          const book = await storage.getBook(item.bookId);
          return {
            ...item,
            book
          };
        })
      );
      
      const orderWithItems = {
        ...newOrder,
        items: itemsWithBooks
      };
      
      res.status(201).json(orderWithItems);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Get book categories, conditions, and formats
  app.get("/api/book-attributes", (req: Request, res: Response) => {
    res.json({
      categories: bookCategories,
      conditions: bookConditions,
      formats: bookFormats
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
