-- ============================================================
--  TOML — Top On My List
--  Schéma complet Supabase
--  À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================


-- ============================================================
-- 0. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- 1. TYPES PERSONNALISÉS (ENUMs)
-- ============================================================

-- Visibilité d'une wishlist
CREATE TYPE public.wishlist_visibility AS ENUM (
  'private',   -- visible uniquement par le propriétaire
  'friends',   -- visible par le propriétaire + ses amis
  'public'     -- visible par tout le monde
);

-- Statut d'un item
CREATE TYPE public.item_status AS ENUM (
  'available',  -- personne n'a réservé
  'reserved',   -- réservé par un ami (gardé secret au propriétaire)
  'purchased'   -- offert
);

-- Priorité d'un item
CREATE TYPE public.item_priority AS ENUM (
  'low',
  'medium',
  'high'
);

-- Statut d'une relation d'amitié
CREATE TYPE public.friendship_status AS ENUM (
  'pending',   -- demande envoyée, en attente
  'accepted',  -- amitié confirmée
  'rejected',  -- demande refusée
  'blocked'    -- utilisateur bloqué
);

-- Type de réaction sur un item
CREATE TYPE public.reaction_type AS ENUM (
  'love',   -- ❤️
  'fire',   -- 🔥
  'party',  -- 🎉
  'clap',   -- 👏
  'eyes'    -- 👀
);


-- ============================================================
-- 2. TABLES
-- ============================================================

-- ------------------------------------------------------------
-- users
-- Profil public d'un utilisateur, lié à auth.users de Supabase.
-- L'id est le même que celui généré par Supabase Auth.
-- La création du profil est automatisée par un trigger (section 4).
-- ------------------------------------------------------------
CREATE TABLE public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL UNIQUE,
  name        TEXT,
  avatar_url  TEXT,
  birthday    DATE,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS
  'Profil public des utilisateurs. Lié 1-pour-1 à auth.users.';


-- ------------------------------------------------------------
-- wishlists
-- Une liste de souhaits appartenant à un utilisateur.
-- La visibilité détermine qui peut la voir.
-- ------------------------------------------------------------
CREATE TABLE public.wishlists (
  id           UUID                      PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID                      NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title        TEXT                      NOT NULL,
  description  TEXT,
  cover_url    TEXT,
  visibility   public.wishlist_visibility NOT NULL DEFAULT 'friends',
  archived     BOOLEAN                   NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ               NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.wishlists IS
  'Listes de souhaits. visibility contrôle qui peut voir la liste.';
COMMENT ON COLUMN public.wishlists.archived IS
  'Liste archivée : masquée de la vue principale, conservée en mémoire.';


-- ------------------------------------------------------------
-- items
-- Un article dans une wishlist.
-- Le statut évolue quand un ami réserve ou offre l'article.
-- ------------------------------------------------------------
CREATE TABLE public.items (
  id           UUID                  PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id  UUID                  NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  title        TEXT                  NOT NULL,
  image_url    TEXT,
  price        NUMERIC(10, 2),
  source_url   TEXT,
  note         TEXT,
  priority     public.item_priority  NOT NULL DEFAULT 'medium',
  status       public.item_status    NOT NULL DEFAULT 'available',
  created_at   TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.items IS
  'Articles dans une wishlist. status reflète la progression (available → reserved → purchased).';


-- ------------------------------------------------------------
-- reservations
-- Un ami réserve un item pour l'offrir.
-- Contrainte UNIQUE sur item_id : un item ne peut être réservé
-- que par une seule personne à la fois.
-- Le propriétaire de la wishlist ne doit PAS voir cette table
-- (effet de surprise) — géré par les politiques RLS.
-- ------------------------------------------------------------
CREATE TABLE public.reservations (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id           UUID        NOT NULL UNIQUE REFERENCES public.items(id) ON DELETE CASCADE,
  reserver_user_id  UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.reservations IS
  'Réservations d''items par des amis. Cachées au propriétaire de la wishlist.';


-- ------------------------------------------------------------
-- friendships
-- Relation d'amitié entre deux utilisateurs.
-- user_id_1 est toujours l'expéditeur de la demande.
-- L'index unique bidirectionnel empêche les doublons (A→B et B→A).
-- ------------------------------------------------------------
CREATE TABLE public.friendships (
  id          UUID                      PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1   UUID                      NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_id_2   UUID                      NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status      public.friendship_status  NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ               NOT NULL DEFAULT NOW(),

  CONSTRAINT no_self_friendship CHECK (user_id_1 <> user_id_2)
);

-- Index bidirectionnel : interdit (A, B) et (B, A) en même temps
CREATE UNIQUE INDEX unique_friendship_pair
  ON public.friendships (LEAST(user_id_1, user_id_2), GREATEST(user_id_1, user_id_2));

COMMENT ON TABLE public.friendships IS
  'Relations d''amitié. user_id_1 = expéditeur, user_id_2 = destinataire.';


-- ------------------------------------------------------------
-- reactions
-- Réaction emoji d'un utilisateur sur un item.
-- Contrainte UNIQUE (item_id, user_id) : une seule réaction par
-- utilisateur par item (on peut changer le type, pas en ajouter).
-- ------------------------------------------------------------
CREATE TABLE public.reactions (
  id             UUID                 PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id        UUID                 NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id        UUID                 NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reaction_type  public.reaction_type NOT NULL,
  created_at     TIMESTAMPTZ          NOT NULL DEFAULT NOW(),

  UNIQUE (item_id, user_id)
);

COMMENT ON TABLE public.reactions IS
  'Réactions emoji sur les items. Une par utilisateur par item.';


-- ------------------------------------------------------------
-- comments
-- Commentaire d'un utilisateur sur une wishlist.
-- Le propriétaire peut supprimer n'importe quel commentaire
-- sur ses propres wishlists.
-- ------------------------------------------------------------
CREATE TABLE public.comments (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id  UUID        NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.comments IS
  'Commentaires sur les wishlists. Le propriétaire peut modérer.';


-- ============================================================
-- 3. INDEX DE PERFORMANCE
-- ============================================================

CREATE INDEX ON public.wishlists     (user_id);
CREATE INDEX ON public.wishlists     (visibility) WHERE archived = FALSE;
CREATE INDEX ON public.items         (wishlist_id);
CREATE INDEX ON public.items         (status);
CREATE INDEX ON public.reservations  (reserver_user_id);
CREATE INDEX ON public.friendships   (user_id_1);
CREATE INDEX ON public.friendships   (user_id_2);
CREATE INDEX ON public.friendships   (status);
CREATE INDEX ON public.reactions     (item_id);
CREATE INDEX ON public.comments      (wishlist_id);
CREATE INDEX ON public.comments      (user_id);


-- ============================================================
-- 4. TRIGGER — Création automatique du profil utilisateur
-- ============================================================
-- Quand Supabase Auth crée un nouvel auth.users, ce trigger
-- insère automatiquement une ligne dans public.users.
-- Les métadonnées (name, avatar_url) sont passées lors du
-- signup via supabase.auth.signUp({ options: { data: {...} } }).
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 5. FONCTIONS HELPER POUR LES POLITIQUES RLS
-- ============================================================
-- Ces fonctions sont SECURITY DEFINER : elles s'exécutent avec
-- les droits du créateur (superuser) et contournent le RLS des
-- tables qu'elles interrogent. Cela évite les récursions infinies
-- dans les politiques.
-- ============================================================

-- Retourne TRUE si les deux utilisateurs ont une amitié 'accepted'
CREATE OR REPLACE FUNCTION public.are_friends(user_a UUID, user_b UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
      AND LEAST(user_id_1, user_id_2)    = LEAST(user_a, user_b)
      AND GREATEST(user_id_1, user_id_2) = GREATEST(user_a, user_b)
  );
$$;

-- Retourne TRUE si l'utilisateur connecté peut voir la wishlist donnée
CREATE OR REPLACE FUNCTION public.can_view_wishlist(p_wishlist_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wishlists w
    WHERE w.id = p_wishlist_id
      AND (
        w.visibility = 'public'
        OR w.user_id  = auth.uid()
        OR (
          w.visibility = 'friends'
          AND public.are_friends(w.user_id, auth.uid())
        )
      )
  );
$$;


-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments     ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- USERS
-- Tout utilisateur authentifié peut voir tous les profils
-- (nécessaire pour rechercher des amis).
-- Seul l'utilisateur lui-même peut modifier ou supprimer son profil.
-- ------------------------------------------------------------

CREATE POLICY "users: lecture de tous les profils"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users: création de son propre profil"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "users: mise à jour de son propre profil"
  ON public.users FOR UPDATE
  TO authenticated
  USING     (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "users: suppression de son propre profil"
  ON public.users FOR DELETE
  TO authenticated
  USING (id = auth.uid());


-- ------------------------------------------------------------
-- WISHLISTS
-- La visibilité détermine qui peut lire.
-- Seul le propriétaire peut créer / modifier / supprimer.
-- ------------------------------------------------------------

CREATE POLICY "wishlists: lecture selon visibilité"
  ON public.wishlists FOR SELECT
  TO authenticated
  USING (
    visibility = 'public'
    OR user_id = auth.uid()
    OR (visibility = 'friends' AND public.are_friends(user_id, auth.uid()))
  );

CREATE POLICY "wishlists: création par le propriétaire"
  ON public.wishlists FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "wishlists: modification par le propriétaire"
  ON public.wishlists FOR UPDATE
  TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "wishlists: suppression par le propriétaire"
  ON public.wishlists FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- ITEMS
-- Lisibles si on peut voir la wishlist parente.
-- Modifiables uniquement par le propriétaire de la wishlist.
-- ------------------------------------------------------------

CREATE POLICY "items: lecture si wishlist visible"
  ON public.items FOR SELECT
  TO authenticated
  USING (public.can_view_wishlist(wishlist_id));

CREATE POLICY "items: création par le propriétaire de la wishlist"
  ON public.items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE id = wishlist_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "items: modification par le propriétaire de la wishlist"
  ON public.items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE id = wishlist_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "items: suppression par le propriétaire de la wishlist"
  ON public.items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE id = wishlist_id AND user_id = auth.uid()
    )
  );


-- ------------------------------------------------------------
-- RESERVATIONS
-- RÈGLE CLÉ : le propriétaire de la wishlist ne voit PAS
-- les réservations (effet de surprise préservé).
-- Seul le réservant voit ses propres réservations.
-- Un ami peut réserver un item visible, s'il n'en est pas l'auteur.
-- ------------------------------------------------------------

CREATE POLICY "reservations: lecture par le réservant uniquement"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (reserver_user_id = auth.uid());

CREATE POLICY "reservations: création si ami et non-propriétaire"
  ON public.reservations FOR INSERT
  TO authenticated
  WITH CHECK (
    reserver_user_id = auth.uid()
    -- L'item doit être dans une wishlist visible par l'utilisateur
    AND public.can_view_wishlist(
      (SELECT wishlist_id FROM public.items WHERE id = item_id)
    )
    -- L'utilisateur ne doit PAS être le propriétaire de la wishlist
    AND NOT EXISTS (
      SELECT 1
      FROM public.items i
      JOIN public.wishlists w ON w.id = i.wishlist_id
      WHERE i.id = item_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "reservations: annulation par le réservant"
  ON public.reservations FOR DELETE
  TO authenticated
  USING (reserver_user_id = auth.uid());


-- ------------------------------------------------------------
-- FRIENDSHIPS
-- Chaque utilisateur voit uniquement les amitiés qui le concernent.
-- Seul l'expéditeur (user_id_1) peut envoyer une demande.
-- Seul le destinataire (user_id_2) peut accepter / refuser.
-- L'un ou l'autre peut supprimer la relation.
-- ------------------------------------------------------------

CREATE POLICY "friendships: lecture des amitiés personnelles"
  ON public.friendships FOR SELECT
  TO authenticated
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

CREATE POLICY "friendships: envoi d'une demande"
  ON public.friendships FOR INSERT
  TO authenticated
  WITH CHECK (user_id_1 = auth.uid() AND status = 'pending');

CREATE POLICY "friendships: réponse par le destinataire"
  ON public.friendships FOR UPDATE
  TO authenticated
  USING     (user_id_2 = auth.uid())
  WITH CHECK (user_id_2 = auth.uid());

CREATE POLICY "friendships: suppression par l'un ou l'autre"
  ON public.friendships FOR DELETE
  TO authenticated
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());


-- ------------------------------------------------------------
-- REACTIONS
-- Visibles si on peut voir la wishlist parente de l'item.
-- Chaque utilisateur gère uniquement ses propres réactions.
-- ------------------------------------------------------------

CREATE POLICY "reactions: lecture si wishlist visible"
  ON public.reactions FOR SELECT
  TO authenticated
  USING (
    public.can_view_wishlist(
      (SELECT wishlist_id FROM public.items WHERE id = item_id)
    )
  );

CREATE POLICY "reactions: ajout si wishlist visible"
  ON public.reactions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.can_view_wishlist(
      (SELECT wishlist_id FROM public.items WHERE id = item_id)
    )
  );

CREATE POLICY "reactions: modification de sa propre réaction"
  ON public.reactions FOR UPDATE
  TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reactions: suppression de sa propre réaction"
  ON public.reactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- COMMENTS
-- Visibles si on peut voir la wishlist.
-- Supprimables par l'auteur OU par le propriétaire de la wishlist
-- (modération).
-- ------------------------------------------------------------

CREATE POLICY "comments: lecture si wishlist visible"
  ON public.comments FOR SELECT
  TO authenticated
  USING (public.can_view_wishlist(wishlist_id));

CREATE POLICY "comments: ajout si wishlist visible"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.can_view_wishlist(wishlist_id)
  );

CREATE POLICY "comments: modification de son propre commentaire"
  ON public.comments FOR UPDATE
  TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments: suppression par l'auteur ou propriétaire de la wishlist"
  ON public.comments FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE id = wishlist_id AND user_id = auth.uid()
    )
  );
