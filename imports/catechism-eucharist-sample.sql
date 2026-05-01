begin;

with inserted_source as (
  insert into public.sources (title, source_url, publisher, authority_tier, source_type, status)
  values ('Catechism Eucharist Sample', 'https://www.vatican.va/archive/ENG0015/_P3W.HTM', 'Vatican', 1, 'catechism', 'draft')
  returning id
)
insert into public.source_chunks (source_id, chunk_text, citation_label, section_label, paragraph_number, authority_tier, token_count)
select inserted_source.id, chunk_text, citation_label, section_label, paragraph_number, authority_tier, token_count
from inserted_source, (values
  ('The Eucharist is the source and summit of the Christian life. The other sacraments, and indeed all ecclesiastical ministries and works of the apostolate, are bound up with the Eucharist and are oriented toward it.', 'CCC 1324', 'CCC 1324', '1324', 1, 52),
  ('The Eucharist is the efficacious sign and sublime cause of that communion in the divine life and that unity of the People of God by which the Church is kept in being.', 'CCC 1325', 'CCC 1325', '1325', 1, 48),
  ('In brief, the Eucharist is the sum and summary of our faith. Our way of thinking is attuned to the Eucharist, and the Eucharist in turn confirms our way of thinking.', 'CCC 1327', 'CCC 1327', '1327', 1, 46)
) as chunks(chunk_text, citation_label, section_label, paragraph_number, authority_tier, token_count);

commit;
