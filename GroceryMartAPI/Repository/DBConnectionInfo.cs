using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Interface;
using log4net;
using System.Reflection;
using Logging;
using StackExchange.Redis;

namespace Repository
{
    public class DBConnectionInfo : IDBConnectionInfo
    {
        public static Lazy<ConnectionMultiplexer> connection;
        public static IDatabase cache;
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
        private string _connection;
        private string _sqltext;
        private CommandType _commandtype;
        private List<SqlParameter> _inParams;
        private Action<Exception> _exceptionBehavior = delegate { };
        public DBConnectionInfo()
        {
            //builder.DataSource = "smartboarddbserver.database.windows.net";
            //builder.UserID = "smartboard";
            //builder.Password = "X!gul$@3B";
            //builder.InitialCatalog = "Board";
            builder.DataSource = "azure301-jan19.database.windows.net";
            builder.UserID = "mindtreeazure";
            builder.Password = "Welcome@123";
            builder.InitialCatalog = "GroceryMart";
            _connection = builder.ConnectionString;


            string cacheConnection = string.Empty;
            connection = new Lazy<ConnectionMultiplexer>(() =>
            {
                cacheConnection = "grocerymartcache.redis.cache.windows.net:6380,password=lO04eAb9V5VODey+MUU6G7BqRoR9c3IE+34E9QvcY2w=,ssl=True,abortConnect=False";
                return ConnectionMultiplexer.Connect(cacheConnection);
            });

        }

        public T executeScalar<T>(string Sqlquery)
        {

            T result = default(T);

            try
            {
                //try
                //{
                    using (var connection = new SqlConnection(_connection))
                    {
                        SqlCommand cmd = new SqlCommand(Sqlquery, connection);
                        connection.Open();
                        // result = (T)cmd.ExecuteScalar();
                        var result1 = cmd.ExecuteScalar();
                        return (T)(dynamic)result1;
                    }
                //}
                //catch (Exception ex)
                //{
                //    _exceptionBehavior(ex);
                //}

                //return result;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return result;
            }
        }
        public DataTable Readdata(string Sqlquery)
        {
            try
            {
                var connection1 = new SqlConnection(_connection);

                cache = connection.Value.GetDatabase();

                cache.StringSet("conn", _connection).ToString();
                string ConnectionFromRedis = cache.StringGet("conn").ToString();

                using (SqlDataAdapter dAd = new SqlDataAdapter(Sqlquery, ConnectionFromRedis))
                {
                    DataTable dTable = new DataTable();
                    dAd.Fill(dTable);
                    //  dr = dTable.AsEnumerable().ToList();
                    return dTable;
                }
               // cache.KeyExpire("conn",);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
        public int ExecuteNonQuery(CommandType commandType, string commandText)
        {
            try { 
            int result = 0;
           
                using (var connection = new SqlConnection(_connection))
                {
                    SqlCommand cmd;
                    connection.Open();
                    cmd = new SqlCommand(commandText, connection);
                    
                    result = cmd.ExecuteNonQuery();
                    connection.Close();
                    return result;
                }
           
           
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return 0;
            }
        }

    }
}
