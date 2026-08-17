export interface USER {
  name: string;
  email: string;
  password: string;
  title: Title;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}
export type Title = 'Mr' | 'Mrs' | 'Miss';
