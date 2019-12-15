using ConsumeGroceryMartAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ConsumeGroceryMartAPI.Controllers
{
    public class UserController : Controller
    {
        FetchInfo fetchInfo = new FetchInfo();

        User LoggedinUser = new User();
        // GET: User
        public ActionResult Index()
        {
            //string LoggeduserName = Session["LoggedUser"].ToString();
            if (Session["LoggedUser"] !=null)
            {
                string LoggeduserName = Session["LoggedUser"].ToString();
            }
            if (Session["LoggedUser"] == null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("GetAllItems", "Home");
            }
        }
        [HttpPost]
        public async Task<ActionResult> Login(FormCollection Logindata)
        {
            if (Session["LoggedUser"] == null)
            {
                string email = Logindata["name"];
                string pwd = Logindata["pwd"];

                string url = "api/User/ValidateUser";

                url = url + "?Email=" + email + "&password=" + pwd;

                var userDetails = fetchInfo.APIGetCalluser<User>(url).Result;

                if (userDetails != null)
                {
                    if (userDetails.Email != null)
                    {
                        Session["LoggedUser"] = userDetails as User;

                        return RedirectToAction("GetAllItems", "Home");
                    }
                    else
                    {
                        TempData["errorMsgForLogin"] = "Invalid Credentials Please check Email/Password.";
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    TempData["errorMsgForLogin"] = "Invalid Credentials Please check Email/Password.";
                    return RedirectToAction("Index");
                }
            }
            else
            {
                return RedirectToAction("GetAllItems", "Home");
            }
        }
        public async Task<ActionResult> Register(User userdata)
        {
            string url = "api/User/PostUser";

            url = url + "?user=" + User;

            bool result = fetchInfo.PostData<User>(userdata, url);

            if (result)
            {
                TempData["SuccessMsg"] = "User created Login Now..!!";
                
                return RedirectToAction("Index", "User");
            }

            else
            {
                TempData["errorForUser"] = "User cannot be created!! Sorry";

                return RedirectToAction("Index", "User");
            }
        }
        public JsonResult GoogleLogin(string email, string name, string gender, string lastname, string location)
        {
            
            string url = "api/User/ValidateUser";

            url = url + "?Email=" + email + "&password=" + "0";

            var userDetails = fetchInfo.APIGetCalluser<User>(url).Result;

            if (userDetails != null)
            {
                HttpContext.Session["LoggedUser"] = userDetails as User;

                return Json("success", JsonRequestBehavior.AllowGet);
            }
            else
            {                            
                string urlToPost = "api/User/PostUser";

                User userdata = new User();
                userdata.Age = 0;
                userdata.Name = name;
                userdata.Email = email;
                userdata.isRegisteredbyGmail = true;
                //userdata.UserId
                urlToPost = urlToPost + "?user=" + userdata;
                bool result = fetchInfo.PostData<User>(userdata, urlToPost);
                if (result)
                {
                    Session["LoggedUser"] = userdata as User;
                    return Json("success", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    //TempData["errorForUser"] = "User cannot be created!! Sorry";
                    return Json("User cannot be registered because mailid already regiserted", JsonRequestBehavior.AllowGet);
                }
            }
        }
        public async Task<ActionResult> SignOut()
        {
            Session.Remove("LoggedUser");
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Index","User");
        }
        public async Task<ActionResult> UserProfile()
        {
            User LoggedInUser = Session["LoggedUser"] as User;

            return View(LoggedInUser);
        }
    }
}