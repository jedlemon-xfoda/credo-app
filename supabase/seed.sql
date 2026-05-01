insert into public.sources (title, source_url, publisher, authority_tier, source_type, status)
values
  ('Catechism of the Catholic Church', 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM', 'Vatican', 1, 'catechism', 'active'),
  ('Vatican Documents', 'https://www.vatican.va/content/vatican/en.html', 'Vatican', 1, 'vatican_document', 'active'),
  ('New Advent Catholic Encyclopedia', 'https://www.newadvent.org/', 'New Advent', 3, 'reference', 'active')
on conflict do nothing;

insert into public.topics (title, slug, category, summary, status)
values
  ('The Eucharist', 'the-eucharist', 'Sacraments', 'Catechism, Scripture, councils, saints, and devotional practice.', 'active'),
  ('Confession', 'confession', 'Sacraments', 'Christ''s authority, repentance, absolution, and pastoral care.', 'active'),
  ('Mary and the Saints', 'mary-and-the-saints', 'Doctrine', 'Intercession, devotion, scriptural roots, and common objections.', 'active'),
  ('Purgatory', 'purgatory', 'Doctrine', 'Final purification, prayer for the dead, and Catholic hope.', 'active'),
  ('The Mass', 'the-mass', 'Liturgy', 'Sacrifice, banquet, readings, Eucharistic prayer, and participation.', 'active')
on conflict (slug) do nothing;

insert into public.prayers (title, category, text_english, source_note, status)
values
  ('Sign of the Cross', 'Basic', 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.', 'Traditional Catholic prayer.', 'active'),
  ('Our Father', 'Basic', 'Our Father, who art in heaven, hallowed be thy name...', 'Matthew 6:9-13.', 'active'),
  ('Hail Mary', 'Marian', 'Hail Mary, full of grace, the Lord is with thee...', 'Luke 1:28 and traditional intercession.', 'active'),
  ('Glory Be', 'Basic', 'Glory be to the Father, and to the Son, and to the Holy Spirit...', 'Traditional doxology.', 'active'),
  ('St. Michael Prayer', 'Protection', 'St. Michael the Archangel, defend us in battle...', 'Traditional prayer for protection.', 'active'),
  ('Rosary', 'Marian', 'A meditative prayer on the mysteries of Christ with Mary.', 'Traditional Catholic devotion.', 'active'),
  ('Divine Mercy Chaplet', 'Mercy', 'A chaplet centered on the Passion and mercy of Christ.', 'Divine Mercy devotion.', 'active')
on conflict do nothing;

insert into public.novenas (title, description, category, days, status)
values
  ('Divine Mercy Novena', 'Nine-day Divine Mercy devotion.', 'Novena', '[]'::jsonb, 'active'),
  ('St. Joseph Novena', 'Nine days asking St. Joseph''s intercession.', 'Novena', '[]'::jsonb, 'active'),
  ('Sacred Heart Novena', 'Nine-day devotion to the Sacred Heart.', 'Novena', '[]'::jsonb, 'active')
on conflict do nothing;

