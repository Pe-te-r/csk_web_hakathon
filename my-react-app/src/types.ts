
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
        first_name: string,    
        email: string,
        isActive: boolean,
}

export interface UpdateUserRequest{
        id:string,
        first_name?: string,    
        isActive?: boolean,
        username?:string

}

export interface CategoryResponseType {
  id: string,
  category:string
}

export interface CategoryResponseDetailsType{
  subcategories: {
    id: string,
    subcategory:string
  }[]
}