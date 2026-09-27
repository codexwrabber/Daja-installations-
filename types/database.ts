export type RegistrationStatus = 'pending' | 'submitted' | 'approved' | 'rejected';
export type PaymentStatus = 'unpaid' | 'pending_review' | 'paid';
export type GroupRole = 'owner' | 'admin' | 'member';

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  skills: string[] | null;
  experience: string | null;
  location: string | null;
  date_of_birth: string | null;
  gender: string | null;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  submitted_at: string | null;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  owner_id: string;
  created_at: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
}

export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      worker_profiles: {
        Row: WorkerProfile;
        Insert: Partial<WorkerProfile> & { id: string };
        Update: Partial<WorkerProfile>;
      };
      groups: {
        Row: Group;
        Insert: Partial<Group> & { name: string; owner_id: string };
        Update: Partial<Group>;
      };
      group_members: {
        Row: GroupMember;
        Insert: GroupMember;
        Update: Partial<GroupMember>;
      };
      messages: {
        Row: Message;
        Insert: Partial<Message> & { group_id: string; sender_id: string; content: string };
        Update: Partial<Message>;
      };
    };
  };
}
