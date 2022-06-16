# FT_TRANSCENDENCE

## First run

For the first startup, you need to set up :
- An `.env` file:
```
DB_PATH=<path> (for 42Linux use: ${HOME}/goinfre/db)
```

- A `.db_password.secret` file:
```
echo "<password>" > .db_password.secret
```

## Launch project
```
docker-compose up --build
```

You can build in debug, it will add some containers like adminer :
```
docker-compose --profile debug up --build
```
