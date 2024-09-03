
# Escape Room

A Website for a small Escape Room game

## Getting Started

### Prerequisites

Download the latest releases of: 
- [Node.js](https://nodejs.org/en/download/package-manager)
- [PostgreSQL](https://www.postgresql.org/download)

### Setup

1. Install every needed Node Package
   ```sh
   npm install npm@latest -g
   ```

2. Create a .env file and add this and change "YOURPASSWORD" and "YOURDATABASE" to your chosen password and database name
   ```sh
   PGUSER=postgres
   PGPASSWORD=YOURPASSWORD
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=YOURDATABASE
   ```
3. You can then let it create a table and fill it with the tasks by running the 'createTable.js' once
   ```sh
   node createTable.js
   ```

### Usage

If there was no error start the application with
   ```sh
   node index.js
   ```

You can now go to https://localhost:3000 and try it out

## Demo

Try it out on my [Website](https://projects.anschalten.dev/escape)

## License

[MIT](https://choosealicense.com/licenses/mit/)
