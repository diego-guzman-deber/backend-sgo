-- =========================
-- TABLA CLIENTE
-- =========================
create table customer (
    id bigint generated always as identity primary key,
    external_id text unique,
    name text not null,
    phone text,
    email text,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz, -- Añadido para soft deletes
    synced_at timestamptz default now()
);
-- =========================
-- TABLA AGENTE
-- =========================
create table agent (
    id bigint generated always as identity primary key,
    external_id text unique,
    name text not null,
    is_active boolean default true,
    created_at timestamptz default now(), -- Añadido para consistencia
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now()
);
-- =========================
-- TABLA CANAL DIFUSION
-- =========================
create table media_channel (
    id bigint generated always as identity primary key,
    external_id text unique,
    name text not null,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now()
);
-- =========================
-- TABLA PRODUCTO
-- =========================
create table product (
    id bigint generated always as identity primary key,
    external_id text unique,
    name text not null,
    media_channel_id bigint,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now(),
    foreign key (media_channel_id) references media_channel(id)
);
-- =========================
-- TABLA ACUERDO
-- =========================
create table contract (
    id bigint generated always as identity primary key,
    external_id text unique,
    date date,
    title text,
    content text,
    start_date date,
    end_date date,
    total_amount numeric(12,2),
    own_consumption boolean,
    customer_id bigint,
    is_active boolean default true,
    created_at timestamptz default now(), -- Añadido
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now(),
    foreign key (customer_id) references customer(id)
);
-- =========================
-- TABLA PEDIDO
-- =========================
create table sales_order (
    id bigint generated always as identity primary key,
    external_id text unique,
    customer_id bigint,
    agent_id bigint,
    year int,
    month int,
    total numeric(12,2),
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now(),
    foreign key (customer_id) references customer(id),
    foreign key (agent_id) references agent(id)
);
-- =========================
-- TABLA ORDEN
-- =========================
create table work_order (
    id bigint generated always as identity primary key,
    external_id text unique,
    customer_id bigint,
    media_channel_id bigint,
    product_id bigint,
    description text,
    start_date date,
    end_date date,
    registered_at timestamptz default now(),
    total_amount numeric(12,2),
    source text,
    is_active boolean default true,
    status varchar(20) check (status in ('pending','completed','cancelled')),
    contract_id bigint,
    sales_order_id bigint,
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now(),
    foreign key (customer_id) references customer(id),
    foreign key (media_channel_id) references media_channel(id),
    foreign key (product_id) references product(id),
    foreign key (contract_id) references contract(id),
    foreign key (sales_order_id) references sales_order(id)
);
-- =========================
-- TABLA DETALLE ORDEN
-- =========================
create table work_order_detail (
    id bigint generated always as identity primary key,
    external_id text unique,
    work_order_id bigint,
    product_id bigint,
    is_active boolean default true,
    status varchar(20) check (status in ('pending','completed','cancelled')),
    scheduled_at timestamptz,
    rescheduled_at timestamptz,
    executed_at timestamptz,
    amount numeric(12,2),
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz,
    synced_at timestamptz default now(),
    foreign key (work_order_id) references work_order(id) on delete cascade,
    foreign key (product_id) references product(id)
);
-- =========================
-- TABLA HISTORIAL SINCRONIZACION (NUEVA)
-- =========================
create table sync_history (
    id bigint generated always as identity primary key,
    entity varchar(50) not null, -- Ej: 'pedidos'
    sync_started_at timestamptz not null default now(),
    sync_finished_at timestamptz,
    processed_records int default 0,
    data_range_from timestamptz, -- Desde qué fecha se solicitó a la API
    data_range_to timestamptz, -- Hasta qué fecha se solicitó a la API
    status varchar(20) check (status in ('in_progress', 'success', 'failure')),
    error_message text,
    created_at timestamptz default now()
);
-- =========================
-- INDICES
-- =========================
create index idx_work_order_customer on work_order(customer_id);
create index idx_sales_order_customer on sales_order(customer_id);
create index idx_work_order_detail_work_order on work_order_detail(work_order_id);
create index idx_work_order_external_id on work_order(external_id);
create index idx_sales_order_external_id on sales_order(external_id);
create index idx_work_order_detail_external_id on work_order_detail(external_id);
create index idx_contract_external_id on contract(external_id);
create index idx_product_external_id on product(external_id);
create index idx_media_channel_external_id on media_channel(external_id);
create index idx_agent_external_id on agent(external_id);
create index idx_customer_external_id on customer(external_id);
create index idx_sync_history_entity on sync_history(entity);
create index idx_sync_history_status on sync_history(status);