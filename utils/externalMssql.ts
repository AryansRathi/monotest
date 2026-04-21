import sql from 'mssql';

export interface ColumnDefinition {
    name: string;
    type: string;
}

export const DEFAULT_DATABASE = 'externaldb';

/**
 * Programmatic access to the external SQL Server container used in e2e tests.
 * Allows creating databases, tables, and inserting test data at runtime.
 */
export class ExternalMssql {
    private readonly host: string;
    private readonly port: number;
    private readonly user: string;
    private readonly password: string;
    private readonly defaultDatabase: string;
    private readonly pools = new Map<string, sql.ConnectionPool>();

    constructor(config?: {
        host?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
    }) {
        this.host = config?.host ?? process.env.MSSQL_HOST ?? 'localhost';
        this.port = config?.port ?? parseInt(process.env.MSSQL_PORT ?? '1433');
        this.user = config?.user ?? 'sa';
        this.password = config?.password ?? 'sqlserver@123';
        this.defaultDatabase = config?.database ?? DEFAULT_DATABASE;
    }

    private async getPool(database: string): Promise<sql.ConnectionPool> {
        let pool = this.pools.get(database);
        if (!pool) {
            pool = new sql.ConnectionPool({
                server: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                database,
                options: {
                    encrypt: false,
                    trustServerCertificate: true
                },
                pool: {
                    max: 2
                }
            });
            await pool.connect();
            this.pools.set(database, pool);
        }
        return pool;
    }

    async query(
        sqlText: string,
        params?: Record<string, unknown>,
        database?: string
    ): Promise<sql.IResult<Record<string, unknown>>> {
        const pool = await this.getPool(database ?? this.defaultDatabase);
        const request = pool.request();
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
        }
        return await request.query(sqlText);
    }

    async createTable(
        tableName: string,
        columns: ColumnDefinition[],
        database?: string
    ): Promise<void> {
        const columnsSql = columns.map((c) => `[${c.name}] ${c.type}`).join(', ');
        await this.query(`CREATE TABLE [${tableName}] (${columnsSql})`, undefined, database);
    }

    async insertRows(
        tableName: string,
        rows: Record<string, unknown>[],
        database?: string
    ): Promise<void> {
        if (rows.length === 0) return;

        const columns = Object.keys(rows[0]);
        const columnsSql = columns.map((c) => `[${c}]`).join(', ');
        const params: Record<string, unknown> = {};
        const valuesClauses: string[] = [];

        for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
            const row = rows[rowIdx];
            const placeholders = columns.map((col, colIdx) => {
                const paramName = `p${rowIdx}_${colIdx}`;
                params[paramName] = row[col];
                return `@${paramName}`;
            });
            valuesClauses.push(`(${placeholders.join(', ')})`);
        }

        await this.query(
            `INSERT INTO [${tableName}] (${columnsSql}) VALUES ${valuesClauses.join(', ')}`,
            params,
            database
        );
    }

    async close(): Promise<void> {
        for (const pool of Array.from(this.pools.values())) {
            await pool.close();
        }
        this.pools.clear();
    }
}
