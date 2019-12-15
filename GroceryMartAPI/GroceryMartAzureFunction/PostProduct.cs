using System;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Entity;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;

namespace GroceryMartAzureFunction
{
    public static class PostProduct
    {
        [FunctionName("PostProduct")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            dynamic body = await req.Content.ReadAsStringAsync();
            Item item = JsonConvert.DeserializeObject<Item>(body as string);

            var conn = Environment.GetEnvironmentVariable("SQLConnectionString", EnvironmentVariableTarget.Process);
            int result = 0;

            string query = "Insert into ItemList values(" + item.ItemTypeId + ",'" + item.Description + "'," + item.Rating + "," + item.Price + "," + item.Quantity + "," + item.QuantityTypeId + ",'" + item.Itemname + "','" + item.ImagePath + "')";

            using (var connection = new SqlConnection(conn))
            {
                SqlCommand cmd;
                connection.Open();
                cmd = new SqlCommand(query, connection);

                result = cmd.ExecuteNonQuery();
                connection.Close();
                //return result;
            }



            return result == 0
                ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
                : req.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
