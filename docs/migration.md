# KKI Strapi v3 to v4 Migration

## Codemigration

- [Diesem Guide](https://strapi.io/blog/how-to-migrate-from-strapi-v3-to-v4-walkthrough) gefolgt. Beim anpassen der config die alte `plugins.js` und `database.js` uebernommen.

  - `database.js` muss angepasst werden, Achtung: Es ist jetzt `connection.user` statt `username`.

- Nach den codemods passt es fuer das alte repo soweit, die neuen codemods passen schon die Routen an, muss nicht mehr wie im Guide beschrieben manuell gemacht werden

## Datenmigration

- Lokal mit Docker eine PostgreSQL DB erstellen

```sh
docker run --name kki-postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=strapi \
  -e POSTGRES_PASSWORD=0000 \
  -e POSTGRES_DB=strapi \
  -d postgres
```

- Dump der alten DB kopieren

```sh
docker cp [pfad-zum-dump] kki-postgres:/tmp/dump.sql
```

- Docker interaktives Terminal (oder `psql` mit `-h localhost` wenn `psql` lokal installiert ist)

```sh
docker exec -it kki-postgres bash
```

- `strapiv3` Datenbank erstellen

```sh
psql -U strapi -c 'CREATE DATABASE strapiv3 OWNER strapi;'
```

- Dump in `strapiv3` Datenbank laden

```sh
psql -U strapi -d strapiv3 < /tmp/dump.sql
```

- Docker Terminal verlassen, strapi Entwicklungsserver starten

```sh
yarn develop
```

Datenbank `strapi` ist jetzt mit leeren Tabellen mit der neuen Strapi v4 Struktur befuellt. Der Server muss vor den Migrationsskript wieder gestoppt werden.

- Strapi [migration-scripts](https://github.com/strapi/migration-scripts) repo klonen und `.env` erstellen

```sh
git clone https://github.com/strapi/migration-scripts.git
cd migration-scripts/v3-sql-v4-sql/
cat > .env <<EOL
# General Settings
DATABASE_CLIENT=pg
BATCH_SIZE=50

# V3 Settings
DATABASE_V3_HOST=127.0.0.1
DATABASE_V3_PORT=5432
DATABASE_V3_USER=strapi
DATABASE_V3_PASSWORD=0000
DATABASE_V3_DATABASE=strapiv3
DATABASE_V3_SCHEMA=public

# V4 Settings
DATABASE_V4_HOST=127.0.0.1
DATABASE_V4_PORT=5432
DATABASE_V4_USER=strapi
DATABASE_V4_PASSWORD=0000
DATABASE_V4_DATABASE=strapi
DATABASE_V4_SCHEMA=public
EOL
```

Achtung: `migrate/migrateI18n.js` hat einen Fehler und muss angepasst werden.

`const destination = 'i18n_locale'` hat einen falschen Wert und muss auf `i18n_locales` geaendert werden, wie die `source` Variable.

- Dependencies installieren und Datenmigration starten

```sh
yarn
yarn start
```
