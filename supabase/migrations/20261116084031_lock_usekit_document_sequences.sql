drop policy if exists "Users manage their own document sequences"
  on usekit.document_number_sequences;

revoke all on table usekit.document_number_sequences from anon, authenticated;
grant all on table usekit.document_number_sequences to service_role;

revoke all on function usekit.next_document_number(text,integer) from public, anon;
grant execute on function usekit.next_document_number(text,integer) to authenticated;
