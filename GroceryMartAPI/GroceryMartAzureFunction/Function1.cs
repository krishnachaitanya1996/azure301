using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace GroceryMartAzureFunction
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            var conn = Environment.GetEnvironmentVariable("SQLConnectionString", EnvironmentVariableTarget.Process);


            string query = "select * from dbo.QuantityUnits";

            var connection1 = new SqlConnection(conn);
            DataTable dTable = new DataTable();

            using (SqlDataAdapter dAd = new SqlDataAdapter(query, connection1))
            {

                dAd.Fill(dTable);
                //  dr = dTable.AsEnumerable().ToList();
                //return result;
            }
            List<QuantityUnitsDetails> ItemTypesList = new List<QuantityUnitsDetails>();

            for (int i = 0; i < dTable.Rows.Count; i++)
            {
                QuantityUnitsDetails itemType = new QuantityUnitsDetails();
                itemType.QuantityUnitsDescription = dTable.Rows[i]["QuantityUnitsDescription"].ToString();
                itemType.QuantityUnits = int.Parse(dTable.Rows[i]["QuantityUnits"].ToString());

                ItemTypesList.Add(itemType);
            }

            return req.CreateResponse(HttpStatusCode.OK, ItemTypesList);
        }
        public class QuantityUnitsDetails
        {
            public int QuantityUnits { get; set; }
            public string QuantityUnitsDescription { get; set; }
        }
    }

     
}
