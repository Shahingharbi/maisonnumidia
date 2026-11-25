-- Base des commandes Maison Numidia (Cloudflare D1).
-- Appliquer :  npx wrangler d1 execute maisonnumidia-commandes --remote --file=db/schema.sql
-- En local   :  npx wrangler d1 execute maisonnumidia-commandes --local  --file=db/schema.sql

CREATE TABLE IF NOT EXISTS commandes (
  id                    TEXT PRIMARY KEY,
  numero                TEXT NOT NULL UNIQUE,
  cree_le               TEXT NOT NULL,
  maj_le                TEXT NOT NULL,
  statut                TEXT NOT NULL DEFAULT 'Nouvelle',

  -- Ce que le client a saisi
  client                TEXT NOT NULL,
  telephone             TEXT NOT NULL,
  wilaya                TEXT,
  commune               TEXT,
  adresse               TEXT,
  mode_livraison        TEXT,
  note_client           TEXT,

  -- Le panier, figé au moment de la commande (slug, nom, marque, image, prix, qte)
  articles              TEXT NOT NULL,
  total_produits        INTEGER NOT NULL DEFAULT 0,
  frais_livraison       INTEGER NOT NULL DEFAULT 0,
  total                 INTEGER NOT NULL DEFAULT 0,

  -- Suivi interne
  qui_gere              TEXT,
  remise                INTEGER NOT NULL DEFAULT 0,
  achat_fournisseur     INTEGER,
  fournisseur           TEXT,
  frais_livraison_payes INTEGER,
  autres_frais          INTEGER NOT NULL DEFAULT 0,
  suivi                 TEXT,
  date_envoi            TEXT,
  date_livraison        TEXT,
  date_argent_recu      TEXT,
  relances              INTEGER NOT NULL DEFAULT 0,
  motif                 TEXT,
  note_interne          TEXT,
  source                TEXT
);

CREATE INDEX IF NOT EXISTS idx_commandes_cree_le   ON commandes (cree_le DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_statut    ON commandes (statut);
CREATE INDEX IF NOT EXISTS idx_commandes_telephone ON commandes (telephone);

-- Caisse : qui a avancé quoi, qui a récupéré quoi
CREATE TABLE IF NOT EXISTS operations (
  id       TEXT PRIMARY KEY,
  date     TEXT NOT NULL,
  qui      TEXT,
  type     TEXT NOT NULL,
  montant  INTEGER NOT NULL DEFAULT 0,
  commande TEXT,
  preuve   INTEGER NOT NULL DEFAULT 0,
  note     TEXT,
  cree_le  TEXT NOT NULL
);

-- Numéros qui ont refusé un colis ou donné un faux numéro
CREATE TABLE IF NOT EXISTS liste_noire (
  id        TEXT PRIMARY KEY,
  telephone TEXT NOT NULL UNIQUE,
  nom       TEXT,
  wilaya    TEXT,
  motif     TEXT,
  date      TEXT NOT NULL
);

-- Associés, fournisseurs, charges fixes : une ligne par réglage, valeur en JSON
CREATE TABLE IF NOT EXISTS reglages (
  cle    TEXT PRIMARY KEY,
  valeur TEXT NOT NULL,
  maj_le TEXT NOT NULL
);

-- Téléphones abonnés aux notifications (un par appareil)
CREATE TABLE IF NOT EXISTS abonnes_push (
  id       TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh   TEXT NOT NULL,
  auth     TEXT NOT NULL,
  appareil TEXT,
  cree_le  TEXT NOT NULL
);
