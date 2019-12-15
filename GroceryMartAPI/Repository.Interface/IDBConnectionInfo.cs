using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interface
{
    public interface IDBConnectionInfo
    {
        T executeScalar<T>(string Query);
        //DataTable ExecuteReader(string sp_name, SqlParameter[] parameters);
        //int ExecuteNonQuery(CommandType commandType, string commandText, SqlParameter[] parameters);
        DataTable Readdata(string Sqlquery);

        int ExecuteNonQuery(CommandType commandType, string commandText);
    }
}
