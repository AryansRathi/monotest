import { Pool, type QueryResult } from 'pg';

export interface ColumnDefinition {
    name: string;
    type: string;
}

export interface CreateDatabaseOptions {
    owner?: string;
    template?: string;
    encoding?: string;
    lcCollate?: string;
    lcCtype?: string;
    icuLocale?: string;
    localeProvider?: string;
}

export const DEFAULT_DATABASE = 'externaldb';

/**
 * Programmatic access to the external Postgres container used in e2e tests.
 * Allows creating databases, tables, and inserting test data at runtime.
 */
export class ExternalPostgres {
    private readonly host: string;
    private readonly port: number;
    private readonly user: string;
    private readonly password: string;
    private readonly defaultDatabase: string;
    private readonly pools = new Map<string, Pool>();

    constructor(config?: {
        host?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
    }) {
        this.host = config?.host ?? process.env.POSTGRES_HOST ?? 'localhost';
        this.port = config?.port ?? parseInt(process.env.POSTGRES_PORT ?? '5432');
        this.user = config?.user ?? 'postgres';
        this.password = config?.password ?? 'postgres';
        this.defaultDatabase = config?.database ?? DEFAULT_DATABASE;
    }

    private getPool(database: string): Pool {
        let pool = this.pools.get(database);
        if (!pool) {
            pool = new Pool({
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                database,
                max: 2
            });
            this.pools.set(database, pool);
        }
        return pool;
    }

    async query(sql: string, params?: unknown[], database?: string): Promise<QueryResult> {
        return await this.getPool(database ?? this.defaultDatabase).query(sql, params);
    }

    async createDatabase(name: string, options: CreateDatabaseOptions = {}): Promise<void> {
        let sql = `CREATE DATABASE "${name}"`;
        const withClauses: string[] = [
            `OWNER = ${options.owner ?? 'postgres'}`,
            `TEMPLATE = '${options.template ?? 'template0'}'`,
            `ENCODING = '${options.encoding ?? 'UTF8'}'`,
            `LC_COLLATE = '${options.lcCollate ?? 'de_DE.UTF-8'}'`,
            `LC_CTYPE = '${options.lcCtype ?? 'de_DE.UTF-8'}'`,
            `ICU_LOCALE = '${options.icuLocale ?? 'de-DE'}'`,
            `LOCALE_PROVIDER = '${options.localeProvider ?? 'icu'}'`
        ];
        sql += ` WITH ${withClauses.join(' ')}`;
        await this.query(sql, undefined, 'postgres');
    }

    async dropDatabase(name: string): Promise<void> {
        const pool = this.pools.get(name);
        if (pool) {
            await pool.end();
            this.pools.delete(name);
        }
        await this.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`, undefined, 'postgres');
    }

    async createTable(
        tableName: string,
        columns: ColumnDefinition[],
        database?: string
    ): Promise<void> {
        const columnsSql = columns.map((c) => `"${c.name}" ${c.type}`).join(', ');
        await this.query(`CREATE TABLE "${tableName}" (${columnsSql})`, undefined, database);
    }

    async insertRows(
        tableName: string,
        rows: Record<string, unknown>[],
        database?: string
    ): Promise<void> {
        if (rows.length === 0) return;

        const columns = Object.keys(rows[0]);
        const columnsSql = columns.map((c) => `"${c}"`).join(', ');

        let paramIndex = 1;
        const valuesClauses: string[] = [];
        const params: unknown[] = [];

        for (const row of rows) {
            const placeholders = columns.map(() => `$${paramIndex++}`);
            valuesClauses.push(`(${placeholders.join(', ')})`);
            for (const col of columns) {
                params.push(row[col]);
            }
        }

        await this.query(
            `INSERT INTO "${tableName}" (${columnsSql}) VALUES ${valuesClauses.join(', ')}`,
            params,
            database
        );
    }

    async close(): Promise<void> {
        for (const pool of Array.from(this.pools.values())) {
            await pool.end();
        }
        this.pools.clear();
    }
}
