# FT_TRANSCENDENCE

## First run

For the first startup, you need to set up :
- An `.env` file:

```
DB_PATH=<path> (./private/db) (for 42Linux use: ${HOME}/goinfre/db)
POSTGRES_PASSWORD=<password>
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<db_password>
POSTGRES_DB=<db_name>

# NODE
NODE_ENV=development

# PGADMIN
PGADMIN_PATH=(./private/pgadmin) (for 42Linux use: ${HOME}/goinfre/pgadmin)
PGADMIN_DEFAULT_EMAIL=<mail>
PGADMIN_MAIL=<mail>
PGADMIN_DEFAULT_PASSWORD=<password>
PGADMIN_PASS=<password>

# JWT
JWT_SECRET=ft_transcendenceCvraimentTropBien

```

And give right to pgadmin :
```
chown 5050:5050 (./private/pgadmin) (for 42Linux use: ${HOME}/goinfre/pgadmin)
```

## Launch project
```
docker-compose up --build
```

You can build in debug, it will add some containers like pgadmin :

```
docker-compose --profile debug up --build
```
