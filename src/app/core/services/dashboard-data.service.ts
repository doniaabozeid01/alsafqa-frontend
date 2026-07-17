import { Injectable } from '@angular/core';

export interface DashMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DashProduct {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

export interface DashGalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private messages: DashMessage[] = [
    {
      id: 1,
      name: 'محمود',
      email: 'mahmoud@example.com',
      phone: '+20 100 000 0000',
      message: 'أرغب في الاستفسار عن خدمات الشحن والتخليص الجمركي.',
      date: '2024/02/08 07:05 PM',
      read: false,
    },
  ];

  private products: DashProduct[] = [
    {
      id: 1,
      title: 'منتجات استهلاكية',
      subtitle: 'ماركات عالمية',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=70',
      active: true,
    },
    {
      id: 2,
      title: 'أجهزة إلكترونية',
      subtitle: 'أحدث التقنيات',
      image:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=70',
      active: true,
    },
    {
      id: 3,
      title: 'مواد صناعية',
      subtitle: 'جودة موثوقة',
      image:
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=600&q=70',
      active: true,
    },
  ];

  private gallery: DashGalleryItem[] = [
    {
      id: 1,
      title: 'الاتحاد',
      category: 'عام',
      image:
        'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=70',
      active: true,
    },
  ];

  getMessages(): DashMessage[] {
    return [...this.messages];
  }

  getUnreadCount(): number {
    return this.messages.filter((m) => !m.read).length;
  }

  markRead(id: number): void {
    const msg = this.messages.find((m) => m.id === id);
    if (msg) msg.read = true;
  }

  deleteMessage(id: number): void {
    this.messages = this.messages.filter((m) => m.id !== id);
  }

  getProducts(): DashProduct[] {
    return [...this.products];
  }

  getActiveProductsCount(): number {
    return this.products.filter((p) => p.active).length;
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter((p) => p.id !== id);
  }

  addProduct(input: Omit<DashProduct, 'id'>): DashProduct {
    const item: DashProduct = {
      ...input,
      id: Date.now(),
    };
    this.products = [item, ...this.products];
    return item;
  }

  updateProduct(id: number, input: Omit<DashProduct, 'id'>): void {
    this.products = this.products.map((p) =>
      p.id === id ? { ...p, ...input } : p
    );
  }

  getGallery(): DashGalleryItem[] {
    return [...this.gallery];
  }

  deleteGalleryItem(id: number): void {
    this.gallery = this.gallery.filter((g) => g.id !== id);
  }

  addGalleryItem(input: Omit<DashGalleryItem, 'id'>): DashGalleryItem {
    const item: DashGalleryItem = {
      ...input,
      id: Date.now(),
    };
    this.gallery = [item, ...this.gallery];
    return item;
  }

  updateGalleryItem(id: number, input: Omit<DashGalleryItem, 'id'>): void {
    this.gallery = this.gallery.map((g) =>
      g.id === id ? { ...g, ...input } : g
    );
  }

  getStats() {
    return {
      totalMessages: this.messages.length,
      unreadMessages: this.getUnreadCount(),
      totalProducts: this.products.length,
      activeProducts: this.getActiveProductsCount(),
      galleryImages: this.gallery.length,
    };
  }
}
