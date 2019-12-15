using Agent.Interface;
using Entity;
using log4net;
using Logging;
using Microsoft.Azure.ServiceBus;
//using Microsoft.Azure.ServiceBus;
using Microsoft.ServiceBus.Messaging;

using Newtonsoft.Json;
using Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Agent
{
    public class OrderProduct : IOrderProduct
    {
        static string connectionString = "Endpoint=sb://myfirsteventhubtrail.servicebus.windows.net/;SharedAccessKeyName=Try;SharedAccessKey=sRnr2RnkFGrfaUPK5lcctWE+0Sbb86og9bS/3BvABAE=;EntityPath=trail";
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        const string ServiceBusConnectionString = "Endpoint=sb://grocerymartservicebus.servicebus.windows.net/;SharedAccessKeyName=LogicAppmanageaccess;SharedAccessKey=8cz8x8zu8V70hef/XXNpcRc5H+1zbE6IfiJYoIxGycQ=";
        const string QueueName = "storemaildata";
        static IQueueClient queueClient;    

        private readonly IDBConnectionInfo dbconnectionInfo;
        public OrderProduct(IDBConnectionInfo dbconnectionInfo)
        {
            this.dbconnectionInfo = dbconnectionInfo;

        }

        public async Task<int> PlaceOrder(OrderProducts product)
        {
            try
            {
                var eventHubClient = EventHubClient.CreateFromConnectionString(connectionString);
               

                int itemId = int.Parse(product.Itemid);
                int QuantityOrdered = int.Parse(product.Quantity);
                int UserId = int.Parse(product.UserId);

                string query = "insert into OrderedByuser" +
                                " values(" + itemId + "," + QuantityOrdered + ",'" + product.address + "' , (select MailId from RegisteredUserDetails where userId = " + UserId + "))";

                int StatusOfOrder = dbconnectionInfo.ExecuteNonQuery(CommandType.Text, query);


                 var res = eventHubClient.SendAsync(new EventData(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(product)))).GetAwaiter();


                // For queue
                 queueClient = new Microsoft.Azure.ServiceBus.QueueClient(ServiceBusConnectionString, QueueName);

                string messageBody = $"Order placed Successfully ";
                var message = new Message(Encoding.UTF8.GetBytes(messageBody));

                //Send the message to the queue
                await queueClient.SendAsync(message);

                await queueClient.CloseAsync();

                return StatusOfOrder;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return 0;
            }

        }
    }
}
