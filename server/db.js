// db.js — connects to MySQL and creates the database + tables if they don't exist
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function getDbConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, "") || (process.env.DB_NAME || "placetrack"),
        ssl: process.env.DB_SSL === "false" ? undefined : { rejectUnauthorized: false },
      };
    } catch (e) {
      console.warn("Could not parse DATABASE_URL, falling back to individual vars");
    }
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "placetrack",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  };
}

const dbConfig = getDbConfig();
const dbName = dbConfig.database || "placetrack";

// 1) create database if missing  2) create tables from schema.sql
async function initDatabase() {
  const baseConfig = { ...dbConfig };
  delete baseConfig.database;

  // Try creating database if permitted (e.g. on self-hosted/local MySQL)
  try {
    const first = await mysql.createConnection(baseConfig);
    await first.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await first.end();
  } catch (err) {
    // Cloud MySQL instances (Aiven, TiDB, PlanetScale) usually restrict CREATE DATABASE.
    // The designated database already exists, so continue.
  }

  const second = await mysql.createConnection({ ...dbConfig, multipleStatements: true });
  await second.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  await second.end();
  console.log("✅ Database and tables verified successfully.");
}

// pool = reusable connections used by every route
const pool = mysql.createPool({ ...dbConfig, connectionLimit: 5 });

module.exports = { pool, initDatabase };
