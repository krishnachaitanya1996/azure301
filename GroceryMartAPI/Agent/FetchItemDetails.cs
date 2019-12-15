using Agent.Interface;
using Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity;
using System.Data;
using System.Data.SqlClient;
using log4net;
using System.Reflection;
using Logging;

namespace Agent
{
    public class FetchItemDetails : IFetchItemDetails
    {
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private readonly IDBConnectionInfo dbconnectionInfo;
        public FetchItemDetails(IDBConnectionInfo dbconnectionInfo)
        {
            this.dbconnectionInfo = dbconnectionInfo;

        }

        public async Task<IEnumerable<ItemTypeData>> getItemTypes()
        {
            try
            {
                string query = "select * from dbo.ItemTypes";
                var res = dbconnectionInfo.Readdata(query);
                //GmailUser user;
                List<ItemTypeData> ItemTypesList = new List<ItemTypeData>();

                for (int i = 0; i < res.Rows.Count; i++)
                {
                    ItemTypeData itemType = new ItemTypeData();
                    itemType.ItemTyepDescription = res.Rows[i]["ItemTypeDescription"].ToString();
                    itemType.ItemTypeId = int.Parse(res.Rows[i]["ItemTypeId"].ToString());

                    ItemTypesList.Add(itemType);
                }
                return ItemTypesList;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }

        public async Task<IEnumerable<QuantityUnitsDetails>> getQuantityTypes()
        {
            try
            {
                string query = "select * from dbo.QuantityUnits";
                var res = dbconnectionInfo.Readdata(query);
                //GmailUser user;
                List<QuantityUnitsDetails> QuantityTypesList = new List<QuantityUnitsDetails>();

                for (int i = 0; i < res.Rows.Count; i++)
                {
                    QuantityUnitsDetails unitsdata = new QuantityUnitsDetails();
                    unitsdata.QuantityUnitsDescription = res.Rows[i]["QuantityUnitsDescription"].ToString();
                    unitsdata.QuantityUnits = int.Parse(res.Rows[i]["QuantityUnits"].ToString());

                    QuantityTypesList.Add(unitsdata);
                }


                return QuantityTypesList;

            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
        public int postItem(Item item)
        {
            try
            {
                string query = "Insert into ItemList values(" + item.ItemTypeId + ",'" + item.Description + "'," + item.Rating + "," + item.Price + "," + item.Quantity + "," + item.QuantityTypeId + ",'" + item.Itemname + "','" + item.ImagePath + "')";

                int statusOfItem = dbconnectionInfo.ExecuteNonQuery(CommandType.Text, query);
                if (Convert.ToBoolean(statusOfItem))
                {
                    return statusOfItem;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return 0;
            }
        }
        public async Task<IEnumerable<Item>> getAllItem()
        {
            try
            {
                string query = "select * from dbo.ItemList item left join dbo.QuantityUnits qu on qu.QuantityUnits = item.quantityunitsId left join dbo.ItemTypes it on it.ItemTypeId = item.itemTypeid";
                var res = dbconnectionInfo.Readdata(query);
                //GmailUser user;
                List<Item> ItemList = new List<Item>();

                for (int i = 0; i < res.Rows.Count; i++)
                {
                    Item item = new Item();
                    item.Itemid = res.Rows[i]["ItemId"].ToString();
                    item.Itemname = res.Rows[i]["ItemName"].ToString();
                    item.ItemType = res.Rows[i]["ItemName"].ToString();
                    item.Price = int.Parse(res.Rows[i]["Price"].ToString());
                    item.Quantity = int.Parse(res.Rows[i]["QuantityAvailable"].ToString());
                    item.QuantityType = res.Rows[i]["QuantityUnitsDescription"].ToString();
                    item.QuantityTypeId = int.Parse(res.Rows[i]["QuantityUnitsId"].ToString());
                    item.Rating = res.Rows[i]["QuantityUnitsDescription"].ToString();
                    item.Description = res.Rows[i]["Description"].ToString();
                    item.ItemTypeId = int.Parse(res.Rows[i]["ItemTypeId"].ToString());
                    item.ImagePath = res.Rows[i]["ImagePath"].ToString();

                    ItemList.Add(item);
                }
                return ItemList;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
        public async Task<IEnumerable<OrderDetails>> getAllOrderDetails(int id)
        {
            try
            {
                string query = "select* from OrderedByuser o left join itemlist l on l.itemid = o.itemid " +
                                "left join ItemTypes iT on iT.itemtypeid = l.ItemTypeId " +
                                "left join QuantityUnits qu on qu.QuantityUnits = l.Quantityunitsid " +
                                "left join RegisteredUserDetails users on users.MailId =o.MailId  where userId =" + id;

                var result = dbconnectionInfo.Readdata(query);
                List<OrderDetails> orderList = new List<OrderDetails>();

                for (int i = 0; i < result.Rows.Count; i++)
                {
                    OrderDetails order = new OrderDetails();
                    order.Address = result.Rows[i]["Address"].ToString();
                    order.Itemid = result.Rows[i]["Itemid"].ToString();
                    order.Itemname = result.Rows[i]["ItemName"].ToString();
                    order.ItemType = result.Rows[i]["ItemtypeDescription"].ToString();
                    order.MailId = result.Rows[i]["MailId"].ToString();
                    order.QuantityType = result.Rows[i]["QuantityUnitsDescription"].ToString();
                    order.QuantityTypeId = int.Parse(result.Rows[i]["QuantityUnitsId"].ToString());
                    order.QuantityOrdered = int.Parse(result.Rows[i]["QuantityOrdered"].ToString());
                    order.Price = int.Parse(result.Rows[i]["Price"].ToString());
                    order.Description = result.Rows[i]["Description"].ToString();
                    order.UserId = id;
                    orderList.Add(order);
                }
                return orderList;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
        public async Task<IEnumerable<Item>> getAllProductsFor(int ProductTypeId)
        {
            try
            {
                string query = "select * from dbo.ItemList item left join dbo.QuantityUnits qu on qu.QuantityUnits = item.quantityunitsId left join dbo.ItemTypes it on it.ItemTypeId = item.itemTypeid where item.ItemTypeId=" + ProductTypeId;
                var res = dbconnectionInfo.Readdata(query);
                //GmailUser user;
                List<Item> ItemList = new List<Item>();

                for (int i = 0; i < res.Rows.Count; i++)
                {
                    Item item = new Item();
                    item.Itemid = res.Rows[i]["ItemId"].ToString();
                    item.Itemname = res.Rows[i]["ItemName"].ToString();
                    item.ItemType = res.Rows[i]["ItemName"].ToString();
                    item.Price = int.Parse(res.Rows[i]["Price"].ToString());
                    item.Quantity = int.Parse(res.Rows[i]["QuantityAvailable"].ToString());
                    item.QuantityType = res.Rows[i]["QuantityUnitsDescription"].ToString();
                    item.QuantityTypeId = int.Parse(res.Rows[i]["QuantityUnitsId"].ToString());
                    item.Rating = res.Rows[i]["QuantityUnitsDescription"].ToString();
                    item.Description = res.Rows[i]["Description"].ToString();
                    item.ItemTypeId = int.Parse(res.Rows[i]["ItemTypeId"].ToString());
                    item.ImagePath = res.Rows[i]["ImagePath"].ToString();

                    ItemList.Add(item);
                }
                return ItemList;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
    }
}
