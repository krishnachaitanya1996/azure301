using ConsumeGroceryMartAPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
//using System.Web.Http;
using System.Web;
using System.Web.Mvc;

namespace ConsumeGroceryMartAPI.Controllers
{
    public class HomeController : Controller
    {

        FetchInfo fetchInfo = new FetchInfo();


        public async Task<ActionResult> GetAllItems()
        {
          string apiUrlToGetProducts = "api/Item/GetAllItems";

            List<Item> ItemList = new List<Item>();
            
            ItemList = fetchInfo.APIGetCall<List<Item>>(apiUrlToGetProducts).Result;


            foreach (var item in ItemList)
            {
                item.ImagePath = fetchInfo.FetchImageFromBlob(item.ImagePath);
            }


            string apiUrl = "api/Item/getItemTypes";

            var ItemTypes = fetchInfo.APIGetCall<List<ItemTypeData>>(apiUrl).Result;

            string apiForGettypesUrl = "api/Item/getQuantityTypes";

            var QuantityTypes = fetchInfo.APIGetCallFromAzureFunction<List<QuantityUnitsDetails>>(apiForGettypesUrl).Result;

            ViewBag.ItemTypes = new SelectList(ItemTypes, "ItemTypeId", "ItemTyepDescription");

            ViewBag.QuantityTypes = new SelectList(QuantityTypes, "QuantityUnits", "QuantityUnitsDescription");

            return View(ItemList);

        }

        public async Task<ActionResult> AddItem()
        {            

            string apiUrl = "api/Item/getItemTypes";

            var ItemTypes = fetchInfo.APIGetCall<List<ItemTypeData>>(apiUrl).Result;

            string apiForGettypesUrl = "api/Item/getQuantityTypes";

            var QuantityTypes = fetchInfo.APIGetCall<List<QuantityUnitsDetails>>(apiForGettypesUrl).Result;
                        
            ViewBag.ItemTypes = new SelectList(ItemTypes, "ItemTypeId", "ItemTyepDescription");
                        
            ViewBag.QuantityTypes = new SelectList(QuantityTypes, "QuantityUnits", "QuantityUnitsDescription");

            return View();
        }
        [HttpPost]
        public ActionResult AddItem(Item item, HttpPostedFileBase ImageFile)
        {
            if (ImageFile != null)
            {
                string pic = System.IO.Path.GetFileName(ImageFile.FileName);
                string PathForImage = Path.Combine(Server.MapPath("~/Images/ItemImages"), pic);
                //ImageFile.SaveAs(PathForImage);
                //item.ImagePath = PathForImage;

                item.ImagePath = pic;
                string apiUrl = "api/Item/postItem";

                apiUrl = apiUrl + "?item=" + item;
                //Item NewItem = new Item();
                bool result = fetchInfo.PostDataToAzureFunction<Item>(item, apiUrl);
                if (result)
                {
                    ViewBag.StatusMessage = "Product Created successfully";
                    return RedirectToAction("AddItem");
                }
                else
                {
                    ViewBag.StatusMessage = "Something went wrong. Item Couldnot insert";
                    return RedirectToAction("AddItem");
                }
            }
            else
            {
                return RedirectToAction("AddItem");
            }
        }
        public ActionResult OrderList(string id)
        {
            string url = "api/Item/GetOrderDetailsFor";

            int UserId = int.Parse(id);
            url = url + "?UserId=" + UserId;

            var orderDetails = fetchInfo.APIGetCall<List<OrderDetails>>(url).Result;

            if (orderDetails != null)
            {
                return View(orderDetails);
                //return Json(orderDetails, JsonRequestBehavior.AllowGet);
            }
            else
            {
                //string urlToPost = "http://localhost:55463/api/User/PostUser";
                return RedirectToAction("UserProfile", "User");
                              
            }

           // return Json("true", JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult PlaceOrder(List<OrderProducts> ProductsToBeOrdered)
        {

            foreach(var product in ProductsToBeOrdered)
            {
                string url = "api/Order/OrderProduct/";
                User LoggedInUser = Session["LoggedUser"] as User;

                product.UserId = LoggedInUser.UserId.ToString();

                url = url + "?OrderProduct=" + product;
                bool result = fetchInfo.PostData<OrderProducts>(product, url); 
                if(!result)
                {
                    //ViewBag.ErrorForOrder = "Some Order was not placed Successfully, Please check OrderList and place order again for unplaced order";

                    return Json("SomeThing went wrong!!",JsonRequestBehavior.AllowGet);
                }
            }

            return Json("Order Success", JsonRequestBehavior.AllowGet);
        }

        public ActionResult FilterProducts(FormCollection form)
        {
            int producttypeid = int.Parse(form["ItemTypeId"]);

            string url = "api/Item/Getproducts/";

            url = url + "?ProductTypeId=" + producttypeid;

            List<Item> ItemList = new List<Item>();

            ItemList = fetchInfo.APIGetCall<List<Item>>(url).Result;

            foreach (var item in ItemList)
            {
                item.ImagePath = fetchInfo.FetchImageFromBlob(item.ImagePath);
            }

            string apiUrl = "api/Item/getItemTypes";

            var ItemTypes = fetchInfo.APIGetCall<List<ItemTypeData>>(apiUrl).Result;

            string apiForGettypesUrl = "api/Item/getQuantityTypes";

            var QuantityTypes = fetchInfo.APIGetCall<List<QuantityUnitsDetails>>(apiForGettypesUrl).Result;

            ViewBag.ItemTypes = new SelectList(ItemTypes, "ItemTypeId", "ItemTyepDescription");

            ViewBag.QuantityTypes = new SelectList(QuantityTypes, "QuantityUnits", "QuantityUnitsDescription");

            return View("GetAllItems",ItemList);

        }


        public ActionResult About()
        {
            ViewBag.Message = "We may be new to the market. But we promise you to deliver best quality products you have ever seen !!!";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Hyderabad 500072";

            return View();
        }
    }
}