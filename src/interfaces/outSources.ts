export interface IOutSource {
  id: number;
  name: string;
  company_id?: number;
  owner_name?: string;
  phone?: string;
  address?: string;
  description?: string;
  contact_name?: string;
  contact_jobtitle?: string;
  contact_phone?: string;
  contact_line?: string;
  contact_email?: string;
  contact_description?: string;
  tags?: number[];
  rate: number;
  type: "company" | "person" | "workshop" | "other";
}
