/** Standard API envelope returned by the backend */
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors?: string[] | null;
}

export interface BrandDto {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string | null;
  isActive: boolean;
  productsCount: number;
}

export interface ProductDto {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  /** @deprecated prefer quantity + unit */
  weightInGrams?: number;
  quantity?: number;
  unit?: number;
  unitNameAr?: string | null;
  unitNameEn?: string | null;
  packageCount: number;
  imageUrl: string | null;
  isActive: boolean;
  brandId: string;
  brandNameAr: string;
  brandNameEn: string;
}

export interface ProductUnitDto {
  value: number;
  nameAr: string;
  nameEn: string;
}

export interface GalleryDto {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  isActive: boolean;
  galleryCategoryId: string;
  categoryNameAr: string;
  categoryNameEn: string;
}

export interface GalleryCategoryDto {
  id: string;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
}

export interface ContactMessageDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface CreateContactMessageRequest {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  roles?: string[];
}

export interface LoginData {
  token: string;
  expiresAt: string;
  user: AuthUserDto;
}

