# FT_TRANSCENDENCE

## First run

For the first startup, you need to set up :
- An `.env` file:
```
DB_PATH=<path> (./private/db) (for 42Linux use: ${HOME}/goinfre/db)

# PGADMIN
PGADMIN_PATH=(./private/pgadmin) (for 42Linux use: ${HOME}/goinfre/pgadmin)
PGADMIN_MAIL=<mail>
PGADMIN_PASS=<password>
```

And give right to pgadmin :
```
chown 5050:5050 (./private/pgadmin) (for 42Linux use: ${HOME}/goinfre/pgadmin)
```

- A `.db_password.secret` file:
```
echo "<password>" > .db_password.secret
```

## Launch project
```
docker-compose up --build
```

You can build in debug, it will add some containers like pgadmin :
```
docker-compose --profile debug up --build
```
