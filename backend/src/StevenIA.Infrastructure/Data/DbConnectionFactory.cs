using Npgsql;
using System.Data;

namespace StevenIA.Infrastructure.Data;

public class DbConnectionFactory(string connectionString)
{
    public IDbConnection Create() => new NpgsqlConnection(connectionString);
}
