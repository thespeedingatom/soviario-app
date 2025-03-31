export async function up(sql: (query: string) => Promise<void>): Promise<void> {
  await sql(`
    ALTER TABLE products
    ADD COLUMN data_quota_bytes bigint,
    ADD COLUMN wholesale_price numeric,
    ADD COLUMN policy_id integer,
    ADD COLUMN policy_name text,
    ADD COLUMN price_usd numeric,
    ADD COLUMN price_eur numeric,
    ADD COLUMN price_gbp numeric,
    ADD COLUMN price_cad numeric,
    ADD COLUMN price_aud numeric,
    ADD COLUMN price_jpy numeric;

    ALTER TABLE orders
    ADD COLUMN maya_esim_data jsonb;
  `)
}

export async function down(sql: (query: string) => Promise<void>): Promise<void> {
  await sql(`
    ALTER TABLE orders
    DROP COLUMN maya_esim_data;

    ALTER TABLE products
    DROP COLUMN data_quota_bytes,
    DROP COLUMN wholesale_price,
    DROP COLUMN policy_id,
    DROP COLUMN policy_name,
    DROP COLUMN price_usd,
    DROP COLUMN price_eur,
    DROP COLUMN price_gbp,
    DROP COLUMN price_cad,
    DROP COLUMN price_aud,
    DROP COLUMN price_jpy
  `)
}
