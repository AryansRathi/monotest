CREATE DATABASE "externaldb"
                WITH
                OWNER = postgres
                TEMPLATE = 'template0'
                ENCODING = 'UTF8'
                LC_COLLATE = 'de_DE.UTF-8'
                LC_CTYPE = 'de_DE.UTF-8'
                ICU_LOCALE = 'de-DE'
                LOCALE_PROVIDER = 'icu'
                TABLESPACE = pg_default
                CONNECTION LIMIT = -1
                IS_TEMPLATE = False;
 