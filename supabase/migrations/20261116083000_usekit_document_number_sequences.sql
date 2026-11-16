create table if not exists usekit.document_number_sequences (
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('invoice','quotation')),
  sequence_year integer not null,
  last_number integer not null default 0 check (last_number >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, document_type, sequence_year)
);

alter table usekit.document_number_sequences enable row level security;

drop policy if exists "Users manage their own document sequences"
  on usekit.document_number_sequences;

revoke all on table usekit.document_number_sequences from anon, authenticated;
grant all on table usekit.document_number_sequences to service_role;

create or replace function usekit.next_document_number(
  p_document_type text,
  p_year integer default extract(year from now())::integer
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_number integer;
  v_prefix text;
begin
  if auth.uid() is null then
    raise exception 'Sign in to generate a document number';
  end if;

  if p_document_type not in ('invoice','quotation') then
    raise exception 'Unsupported document type';
  end if;

  if p_year < 2000 or p_year > 2200 then
    raise exception 'Invalid document year';
  end if;

  insert into usekit.document_number_sequences(
    user_id, document_type, sequence_year, last_number
  )
  values(auth.uid(), p_document_type, p_year, 1)
  on conflict(user_id, document_type, sequence_year)
  do update set
    last_number = usekit.document_number_sequences.last_number + 1,
    updated_at = now()
  returning last_number into v_number;

  v_prefix := case when p_document_type = 'invoice' then 'INV' else 'QUO' end;
  return v_prefix || '-' || p_year::text || '-' || lpad(v_number::text, 3, '0');
end;
$$;

revoke all on function usekit.next_document_number(text,integer) from public, anon;
grant execute on function usekit.next_document_number(text,integer) to authenticated;
