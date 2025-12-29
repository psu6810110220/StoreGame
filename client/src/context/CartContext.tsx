import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define the shape of a Cart Item
export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

// Define the Context Type
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Load from localStorage on startup
        const savedCart = localStorage.getItem('shopping-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook to use the Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
