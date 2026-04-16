-- GaboShop Initial Schema
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- PROFILES
-- =====================
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'vendor', 'admin')),
  country_code text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- =====================
-- VENDORS
-- =====================
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  business_name text not null,
  description text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  singpay_wallet_id text,
  created_at timestamptz not null default now(),
  unique (profile_id)
);

-- =====================
-- CATEGORIES
-- =====================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name_fr text not null,
  name_en text not null,
  slug text not null unique,
  icon text,
  parent_id uuid references categories(id),
  space text not null default 'both' check (space in ('official', 'marketplace', 'both')),
  created_at timestamptz not null default now()
);

-- =====================
-- PRODUCTS
-- =====================
create table products (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references vendors(id) on delete set null,
  category_id uuid not null references categories(id),
  title_fr text not null,
  title_en text not null,
  description_fr text not null default '',
  description_en text not null default '',
  price numeric(12,2) not null,
  currency text not null default 'XAF',
  images text[] not null default '{}',
  type text not null check (type in ('digital', 'subscription', 'service')),
  delivery_info jsonb not null default '{}',
  is_active boolean not null default true,
  space text not null check (space in ('official', 'marketplace')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- ORDERS
-- =====================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references profiles(id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'delivered', 'cancelled')),
  total_amount numeric(12,2) not null,
  currency text not null default 'XAF',
  payment_api text not null check (payment_api in ('chariow', 'singpay')),
  payment_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- ORDER ITEMS
-- =====================
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  vendor_id uuid references vendors(id),
  quantity int not null default 1,
  unit_price numeric(12,2) not null,
  commission_amount numeric(12,2) not null default 0
);

-- =====================
-- TRANSACTIONS
-- =====================
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id),
  amount numeric(12,2) not null,
  currency text not null default 'XAF',
  status text not null default 'pending',
  payment_api text not null check (payment_api in ('chariow', 'singpay')),
  api_ref text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- =====================
-- COMMISSIONS
-- =====================
create table commissions (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references vendors(id),
  order_item_id uuid not null references order_items(id),
  amount numeric(12,2) not null,
  rate numeric(5,4) not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================
-- REVIEWS
-- =====================
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  client_id uuid not null references profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (product_id, client_id)
);

-- =====================
-- SUPPORT TICKETS
-- =====================
create table support_tickets (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references profiles(id),
  subject text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- SUPPORT MESSAGES
-- =====================
create table support_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references support_tickets(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);

-- =====================
-- NOTIFICATIONS
-- =====================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- SYSTEM CONFIG
-- =====================
create table system_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Default commission rate: 10%
insert into system_config (key, value) values ('commission_rate', '0.10');

-- =====================
-- TRIGGERS: updated_at
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

create trigger support_tickets_updated_at before update on support_tickets
  for each row execute function update_updated_at();

-- =====================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (user_id, full_name, country_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'country_code'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================
-- RLS: Enable
-- =====================
alter table profiles enable row level security;
alter table vendors enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table transactions enable row level security;
alter table commissions enable row level security;
alter table reviews enable row level security;
alter table support_tickets enable row level security;
alter table support_messages enable row level security;
alter table notifications enable row level security;
alter table system_config enable row level security;

-- =====================
-- RLS POLICIES: profiles
-- =====================
create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = user_id);

create policy "Admin can view all profiles"
  on profiles for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- =====================
-- RLS POLICIES: categories
-- =====================
create policy "Anyone can view categories"
  on categories for select using (true);

create policy "Admin can manage categories"
  on categories for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- =====================
-- RLS POLICIES: products
-- =====================
create policy "Anyone can view active official products"
  on products for select using (
    is_active = true and space = 'official'
  );

create policy "Authenticated Gabonese can view marketplace products"
  on products for select using (
    is_active = true
    and space = 'marketplace'
    and exists (
      select 1 from profiles p
      where p.user_id = auth.uid()
      and p.country_code = 'GA'
    )
  );

create policy "Admin can manage all products"
  on products for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "Vendor can manage their own products"
  on products for all using (
    exists (
      select 1 from vendors v
      join profiles p on p.id = v.profile_id
      where p.user_id = auth.uid()
      and v.id = products.vendor_id
    )
  );

-- =====================
-- RLS POLICIES: orders
-- =====================
create policy "Clients can view their own orders"
  on orders for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = orders.client_id)
  );

create policy "Clients can create orders"
  on orders for insert with check (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = orders.client_id)
  );

create policy "Admin can view all orders"
  on orders for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- =====================
-- RLS POLICIES: order_items
-- =====================
create policy "Users can view order items of their orders"
  on order_items for select using (
    exists (
      select 1 from orders o
      join profiles p on p.id = o.client_id
      where p.user_id = auth.uid() and o.id = order_items.order_id
    )
  );

create policy "Vendor can view order items of their products"
  on order_items for select using (
    exists (
      select 1 from vendors v
      join profiles p on p.id = v.profile_id
      where p.user_id = auth.uid() and v.id = order_items.vendor_id
    )
  );

create policy "Admin can view all order items"
  on order_items for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- =====================
-- RLS POLICIES: commissions
-- =====================
create policy "Vendor can view their own commissions"
  on commissions for select using (
    exists (
      select 1 from vendors v
      join profiles p on p.id = v.profile_id
      where p.user_id = auth.uid() and v.id = commissions.vendor_id
    )
  );

create policy "Admin can manage all commissions"
  on commissions for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- =====================
-- RLS POLICIES: reviews
-- =====================
create policy "Anyone can view reviews"
  on reviews for select using (true);

create policy "Authenticated users can create reviews"
  on reviews for insert with check (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = reviews.client_id)
  );

-- =====================
-- RLS POLICIES: support_tickets
-- =====================
create policy "Users can view their own tickets"
  on support_tickets for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = support_tickets.client_id)
  );

create policy "Users can create tickets"
  on support_tickets for insert with check (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = support_tickets.client_id)
  );

create policy "Admin can manage all tickets"
  on support_tickets for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- =====================
-- RLS POLICIES: support_messages
-- =====================
create policy "Users can view messages in their tickets"
  on support_messages for select using (
    exists (
      select 1 from support_tickets t
      join profiles p on p.id = t.client_id
      where p.user_id = auth.uid() and t.id = support_messages.ticket_id
    )
  );

create policy "Users can send messages in their tickets"
  on support_messages for insert with check (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = support_messages.sender_id)
  );

-- =====================
-- RLS POLICIES: notifications
-- =====================
create policy "Users can view their own notifications"
  on notifications for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = notifications.user_id)
  );

create policy "Users can mark their notifications as read"
  on notifications for update using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.id = notifications.user_id)
  );

-- =====================
-- RLS POLICIES: system_config
-- =====================
create policy "Admin can manage system config"
  on system_config for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "Authenticated users can read config"
  on system_config for select using (auth.uid() is not null);

-- =====================
-- INDEXES
-- =====================
create index idx_products_space on products(space) where is_active = true;
create index idx_products_category on products(category_id);
create index idx_orders_client on orders(client_id);
create index idx_order_items_order on order_items(order_id);
create index idx_order_items_vendor on order_items(vendor_id);
create index idx_commissions_vendor on commissions(vendor_id);
create index idx_notifications_user on notifications(user_id, is_read);
create index idx_support_tickets_client on support_tickets(client_id);
