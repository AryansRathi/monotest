#!/bin/bash
set -e

# Start SQL Server in background
/opt/mssql/bin/sqlservr &
pid=$!

# Wait for SQL Server to accept connections
echo "Waiting for SQL Server to start..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" -C -N > /dev/null 2>&1; do
    sleep 1
done
echo "SQL Server is ready."

# Run all SQL scripts
for script in /scripts/*.sql; do
    if [ -f "$script" ]; then
        if /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -i "$script" -C -N; then
            echo "✓ Successfully executed: $script"
        else
            echo "✗ Failed to execute: $script"
            exit 1
        fi
    fi
done

echo "Initialization complete!"

# Wait for SQL Server process
wait $pid