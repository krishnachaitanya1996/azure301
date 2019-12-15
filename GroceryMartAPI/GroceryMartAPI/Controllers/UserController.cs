using Agent.Interface;
using Entity;
using log4net;
using Logging;
using Microsoft.ApplicationInsights;

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
    public class UserController : ApiController
    {
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IUser _user;
        public UserController(IUser _user)
        {
            this._user = _user;
        }


        [Route("api/User/ValidateUser/{Email=}/{password=}")]
        [HttpGet]
        public async Task<IHttpActionResult> ValidateUser(string Email, string password)
        {
            try
            {
                if (password == "0")
                    password = "";
                var userData = await _user.ValidateUser(Email, password);
              
                return Ok(userData);

            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }

        [Route("api/User/PostUser/")]
        [HttpPost]
        public async Task<IHttpActionResult> PostUser(UserDetails user)
        {
            try
            {
                int isUserCreated = await _user.RegisterUser(user);



                return Ok(isUserCreated);

            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
              
    }
}