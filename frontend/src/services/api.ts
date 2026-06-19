import axios, { AxiosInstance, AxiosError } from 'axios';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      },
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Auth endpoints
  async register(email: string, password: string, firstName: string, lastName: string) {
    const response = await this.client.post<ApiResponse<any>>('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post<ApiResponse<any>>('/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    this.clearAuth();
  }

  async getProfile() {
    const response = await this.client.get<ApiResponse<any>>('/auth/profile');
    return response.data.user;
  }

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    const response = await this.client.put<ApiResponse<any>>('/auth/profile', data);
    return response.data.user;
  }

  // Product endpoints
  async getProducts(page: number = 1, limit: number = 20, category?: string, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search }),
    });
    const response = await this.client.get<ApiResponse<any>>(`/products?${params}`);
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.client.get<ApiResponse<any>>(`/products/${id}`);
    return response.data.product;
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    categoryId: string;
    quantity: number;
  }) {
    const response = await this.client.post<ApiResponse<any>>('/products', data);
    return response.data.product;
  }

  async updateProduct(id: string, data: any) {
    const response = await this.client.put<ApiResponse<any>>(`/products/${id}`, data);
    return response.data.product;
  }

  async deleteProduct(id: string) {
    const response = await this.client.delete<ApiResponse<any>>(`/products/${id}`);
    return response.data;
  }

  // Cart endpoints
  async getCart() {
    const response = await this.client.get<ApiResponse<any>>('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number) {
    const response = await this.client.post<ApiResponse<any>>('/cart/items', {
      productId,
      quantity,
    });
    return response.data.cartItem;
  }

  async updateCartItem(cartItemId: string, quantity: number) {
    const response = await this.client.put<ApiResponse<any>>(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return response.data.cartItem;
  }

  async removeCartItem(cartItemId: string) {
    const response = await this.client.delete<ApiResponse<any>>(`/cart/items/${cartItemId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.client.delete<ApiResponse<any>>('/cart');
    return response.data;
  }

  // Order endpoints
  async getOrders(page: number = 1, limit: number = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await this.client.get<ApiResponse<any>>(`/orders?${params}`);
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.client.get<ApiResponse<any>>(`/orders/${id}`);
    return response.data.order;
  }

  async createOrder(shippingAddress: string, billingAddress?: string) {
    const response = await this.client.post<ApiResponse<any>>('/orders', {
      shippingAddress,
      billingAddress,
    });
    return response.data.order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const response = await this.client.put<ApiResponse<any>>(`/orders/${orderId}/status`, {
      status,
    });
    return response.data.order;
  }
}

export const apiClient = new ApiClient();
