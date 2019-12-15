using Agent.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Entity;
using log4net;
using System.Reflection;
using Logging;
//using System.Web.Mvc;

namespace GroceryMartAPI.Controllers
{
    public class ItemController : ApiController
    {
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private readonly IFetchItemDetails _item;
        public ItemController(IFetchItemDetails _item)
        {
            this._item = _item;
        }

        //[System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Item/getItemTypes")]
        public async Task<IHttpActionResult> getItemTypes()
        {
            try
            {
                var ItemTypes = await _item.getItemTypes();

                return Ok(ItemTypes);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
            //return null;
        }
        [System.Web.Http.Route("api/Item/getQuantityTypes")]
        public async Task<IHttpActionResult> getQuantityTypes()
        {
            try
            {
                var QuantityUnits = await _item.getQuantityTypes();

                return Ok(QuantityUnits);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
            //return null;
        }

        [System.Web.Http.Route("api/Item/postItem")]
        [HttpPost]
        public async Task<IHttpActionResult> PostItem(Item item)
        {
            try
            {
                int a = _item.postItem(item);
                if (Convert.ToBoolean(a))
                {
                    return Ok(a);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
            //return null;
        }
        [System.Web.Http.Route("api/Item/getAllItems")]
        public async Task<IHttpActionResult> getAllItems()
        {
            try
            {
                var ItemList = await _item.getAllItem();

                return Ok(ItemList);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
            //return null;
        }
        [Route("api/Item/GetOrderDetailsFor/{UserId=}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetOrderDetailsFor(int UserId)
        {
            try
            {
                var Orderdetails = await _item.getAllOrderDetails(UserId);

                return Ok(Orderdetails);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }

        [Route("api/Item/Getproducts/{ProductTypeId=}")]
        [HttpGet]
        public async Task<IHttpActionResult> Getproducts(int ProductTypeId)
        {
            try
            {
                var Orderdetails = await _item.getAllProductsFor(ProductTypeId);

                return Ok(Orderdetails);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }

    }
}