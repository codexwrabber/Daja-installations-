// NOTE: Row/Insert/Update shapes MUST be `type` aliases (not `interface`).
// supabase-js requires them to satisfy Record<string, unknown>, which
// interfaces do not; using interfaces collapses every query type to `never`.

export type RegistrationStatus = 'pending' | 'submitted' | 'approved' | 'rejected';
export type PaymentStatus = 'unpaid' | 'pending_review' | 'paid';
export type GroupRole = 'owner' | 'admin' | 'member';

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
};

export type WorkerProfile = {
  id: string;
  skills: string[] | null;
  experience: string | null;
  location: string | null;
  date_of_birth: string | null;
  gender: string | null;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  submitted_at: string | null;
};

export type Group = {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  owner_id: string;
  created_at: string;
};

export type GroupMember = {
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
};

export type Message = {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      worker_profiles: {
        Row: WorkerProfile;
        Insert: Partial<WorkerProfile> & { id: string };
        Update: Partial<WorkerProfile>;
        Relationships: [];
      };
      groups: {
        Row: Group;
        Insert: Partial<Group> & { name: string; owner_id: string };
        Update: Partial<Group>;
        Relationships: [];
      };
      group_members: {
        Row: GroupMember;
        Insert: Partial<GroupMember> & { group_id: string; user_id: string };
        Update: Partial<GroupMember>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Partial<Message> & { group_id: string; sender_id: string; content: string };
        Update: Partial<Message>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
