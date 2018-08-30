# Flashcards (in GraphQL)

This is the same server as [this app](https://github.com/jlr7245/flashcards) but using GraphQL.

### Environmental Variables

```bash
SECRET_KEY=# a string of gibberish
API_KEY=# your key for the Indico API https://indico.io/docs
PORT=# your preferred port number (optional)
```

### DB setup

- Create a PSQL database called `code_flashcards_dev`.
- Run `db/migrations/migration-08292018.sql` on that database to set up the schema.
- Run `node db/seeds/seeddb.js` to seed the database.
