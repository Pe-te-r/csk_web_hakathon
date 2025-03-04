
export interface RegisterRequest {
  first_name: string;
  email: string;
  password: string;
  username: string;
}

export interface RegisterSuccessResponse {
  message: string;
}

export interface RegisterErrorResponse {
  message: string;
  error?: string;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

export interface UserResponseType{
        id:string,
        first_name?: string,    
        username?:string
        email: string,
  isActive: boolean,
  img_path?: string
  fa?: string | null
  role:string
  orders?:[]|null

}

export interface UpdateUserRequest{
        id:string,
        first_name?: string,    
        isActive?: boolean,
  username?: string
  img_path?: string
  phone?: string
  business_name?:string

}

export interface CategoryResponseType {
  id: string,
  category:string
}

// export interface CategoryResponseDetailsType{
//   subcategories: {
//     id: string,
//     subcategory?:string
//   }[]
// }
export interface SubCategoryResponseDetailsType{
  category: string,
  id: string,
  subcategory:string
}





export interface ProductRequestType {
  id:string
  product: string;
  sub_category: string;
  price: number;
  description: string;
  img_path: string;
    quantity: number; // Ensure this exists!

}

export interface BasketItem {
  id: string;
  product: string;
  price: number;
  quantity: number;
}
