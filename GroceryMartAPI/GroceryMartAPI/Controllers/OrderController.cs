using Agent.Interface;
using Entity;
using log4net;
using Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
//using System.Web.Mvc;

namespace GroceryMartAPI.Controllers
{
    public class OrderController : ApiController
    {
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private readonly IOrderProduct _order;
        public OrderController(IOrderProduct _order)
        {
            this._order = _order;
        }
        // GET: Order
        //public ActionResult Index()
        //{
        //    return View();
        //}

        [Route("api/Order/OrderProduct/")]
        [HttpPost]
        public async Task<IHttpActionResult> OrderProduct(OrderProducts product)
        {
            try
            {
                int status = await _order.PlaceOrder(product);

                return Ok(status);
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }


    }
}