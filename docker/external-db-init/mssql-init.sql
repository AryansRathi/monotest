-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'externaldb')
BEGIN
    CREATE DATABASE externaldb;
END
GO
