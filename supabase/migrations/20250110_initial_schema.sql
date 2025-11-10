-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create enum types
create type user_role as enum ('owner', 'caregiver', 'both');
create type booking_status as enum ('pending', 'accepted', 'declined', 'completed', 'cancelled');
create type pet_type as enum ('dog', 'cat', 'bird', 'rabbit', 'other');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'owner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Caregiver profiles
create table caregiver_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null unique,
  bio text,
  experience_years integer,
  hourly_rate decimal(10,2),
  address text,
  city text not null,
  postal_code text,
  -- Location for geographic queries (using PostGIS)
  location geography(Point, 4326),
  -- Services offered
  accepts_dogs boolean default false,
  accepts_cats boolean default false,
  accepts_birds boolean default false,
  accepts_rabbits boolean default false,
  accepts_other boolean default false,
  -- Availability
  available boolean default true,
  -- Verification
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pets table
create table pets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  type pet_type not null,
  breed text,
  age integer,
  weight decimal(5,2),
  description text,
  special_needs text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings table
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade not null,
  caregiver_id uuid references caregiver_profiles(id) on delete cascade not null,
  pet_id uuid references pets(id) on delete cascade not null,
  status booking_status not null default 'pending',
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  notes text,
  owner_notes text,
  caregiver_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure end date is after start date
  constraint valid_dates check (end_date > start_date)
);

-- Reviews table
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade not null unique,
  reviewer_id uuid references profiles(id) on delete cascade not null,
  caregiver_id uuid references caregiver_profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Caregiver images/portfolio
create table caregiver_images (
  id uuid primary key default uuid_generate_v4(),
  caregiver_id uuid references caregiver_profiles(id) on delete cascade not null,
  image_url text not null,
  caption text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for better performance
create index profiles_role_idx on profiles(role);
create index caregiver_profiles_user_id_idx on caregiver_profiles(user_id);
create index caregiver_profiles_city_idx on caregiver_profiles(city);
create index caregiver_profiles_available_idx on caregiver_profiles(available);
create index caregiver_profiles_location_idx on caregiver_profiles using gist(location);
create index pets_owner_id_idx on pets(owner_id);
create index bookings_owner_id_idx on bookings(owner_id);
create index bookings_caregiver_id_idx on bookings(caregiver_id);
create index bookings_status_idx on bookings(status);
create index reviews_caregiver_id_idx on reviews(caregiver_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table caregiver_profiles enable row level security;
alter table pets enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table caregiver_images enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Caregiver profiles policies
create policy "Caregiver profiles are viewable by everyone"
  on caregiver_profiles for select
  using (true);

create policy "Users can create their own caregiver profile"
  on caregiver_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own caregiver profile"
  on caregiver_profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own caregiver profile"
  on caregiver_profiles for delete
  using (auth.uid() = user_id);

-- Pets policies
create policy "Pet owners can view their own pets"
  on pets for select
  using (auth.uid() = owner_id);

create policy "Pet owners can insert their own pets"
  on pets for insert
  with check (auth.uid() = owner_id);

create policy "Pet owners can update their own pets"
  on pets for update
  using (auth.uid() = owner_id);

create policy "Pet owners can delete their own pets"
  on pets for delete
  using (auth.uid() = owner_id);

-- Bookings policies
create policy "Users can view their own bookings"
  on bookings for select
  using (
    auth.uid() = owner_id or 
    auth.uid() in (select user_id from caregiver_profiles where id = bookings.caregiver_id)
  );

create policy "Pet owners can create bookings"
  on bookings for insert
  with check (auth.uid() = owner_id);

create policy "Owners and caregivers can update their bookings"
  on bookings for update
  using (
    auth.uid() = owner_id or 
    auth.uid() in (select user_id from caregiver_profiles where id = bookings.caregiver_id)
  );

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

create policy "Booking owners can create reviews"
  on reviews for insert
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from bookings 
      where bookings.id = booking_id 
      and bookings.owner_id = auth.uid()
      and bookings.status = 'completed'
    )
  );

create policy "Reviewers can update their own reviews"
  on reviews for update
  using (auth.uid() = reviewer_id);

create policy "Reviewers can delete their own reviews"
  on reviews for delete
  using (auth.uid() = reviewer_id);

-- Caregiver images policies
create policy "Caregiver images are viewable by everyone"
  on caregiver_images for select
  using (true);

create policy "Caregivers can insert their own images"
  on caregiver_images for insert
  with check (
    auth.uid() in (select user_id from caregiver_profiles where id = caregiver_id)
  );

create policy "Caregivers can update their own images"
  on caregiver_images for update
  using (
    auth.uid() in (select user_id from caregiver_profiles where id = caregiver_id)
  );

create policy "Caregivers can delete their own images"
  on caregiver_images for delete
  using (
    auth.uid() in (select user_id from caregiver_profiles where id = caregiver_id)
  );

-- Functions

-- Function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_caregiver_profiles_updated_at before update on caregiver_profiles
  for each row execute procedure update_updated_at_column();

create trigger update_pets_updated_at before update on pets
  for each row execute procedure update_updated_at_column();

create trigger update_bookings_updated_at before update on bookings
  for each row execute procedure update_updated_at_column();

create trigger update_reviews_updated_at before update on reviews
  for each row execute procedure update_updated_at_column();
