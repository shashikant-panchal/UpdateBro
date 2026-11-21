-- ==============================================================================
-- UPDATE BRO® - Razorpay Payment Columns & Strict User-Specific Orders RLS
-- Safe & idempotent: Run in Supabase Dashboard SQL Editor
-- ==============================================================================

-- 1. ADD RAZORPAY PAYMENT COLUMNS TO ORDERS TABLE
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;
alter table public.orders add column if not exists payment_status text default 'Pending';

create index if not exists idx_orders_razorpay_payment_id on public.orders(razorpay_payment_id);
create index if not exists idx_orders_payment_method on public.orders(payment_method);

-- 2. ENABLE ROW LEVEL SECURITY
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 3. ORDERS SELECT POLICY (STRICTLY USER-SPECIFIC)
-- Regular customers can ONLY see orders that belong to them (by user_id or verified phone).
-- Only authenticated admin accounts can see all customer orders.
drop policy if exists "Users can view their own orders or admin" on public.orders;
create policy "Users can view their own orders or admin"
  on public.orders for select
  to authenticated
  using (
    (user_id is not null and user_id = (select auth.uid()))
    or (
      customer_phone is not null
      and customer_phone in (
        select phone from public.profiles where id = (select auth.uid()) and phone is not null
      )
    )
    or public.is_admin()
  );

-- 4. ORDER ITEMS SELECT POLICY (STRICTLY MATCHING PARENT ORDER)
drop policy if exists "Users can view items of their orders or admin" on public.order_items;
create policy "Users can view items of their orders or admin"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          (o.user_id is not null and o.user_id = (select auth.uid()))
          or (
            o.customer_phone is not null
            and o.customer_phone in (
              select phone from public.profiles where id = (select auth.uid()) and phone is not null
            )
          )
          or public.is_admin()
        )
    )
  );

-- 5. ALLOW PUBLIC / AUTHENTICATED CHECKOUT INSERTS
drop policy if exists "Anyone can insert an order" on public.orders;
create policy "Anyone can insert an order"
  on public.orders for insert
  to public
  with check ( true );

drop policy if exists "Anyone can insert order items" on public.order_items;
create policy "Anyone can insert order items"
  on public.order_items for insert
  to public
  with check ( true );

-- 6. ORDER UPDATES (ADMIN ONLY OR PAYMENT VERIFICATION)
drop policy if exists "Only admin can update or delete orders" on public.orders;
create policy "Only admin can update or delete orders"
  on public.orders for update
  to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );
