using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Agent.Interface;
using Repository;
using Repository.Interface;
using Entity;
using System.Data;
using Logging;
using log4net;
using System.Reflection;

namespace Agent
{
    public class User : IUser
    {
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IDBConnectionInfo dbconnectionInfo;
        public User(IDBConnectionInfo dbconnectionInfo)
        {
            this.dbconnectionInfo = dbconnectionInfo;

        }
        public async Task<IEnumerable<GmailUser>> getUser()
        {
            try
            {
                string query = "select * from dbo.RegisteredUserDetails";
                var res = dbconnectionInfo.Readdata(query);
                GmailUser user;
                List<GmailUser> UserList = new List<GmailUser>();

                for (int i = 0; i < res.Rows.Count; i++)
                {
                    user = new GmailUser();
                    user.Name = res.Rows[i]["Name"].ToString();
                    user.Email = res.Rows[i]["Email"].ToString();
                    user.Gender = res.Rows[i]["Gender"].ToString();
                    user.Phone = res.Rows[i]["Phone"].ToString();
                    user.id = int.Parse(res.Rows[i]["id"].ToString());
                    UserList.Add(user);
                }
                return UserList;
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
        public async Task<UserDetails> ValidateUser(string Email, string password)
        {
            try
            {
                string query = "select * from dbo.RegisteredUserDetails where mailId='" + Email + "'and password = '" + password + "'";
                var res = dbconnectionInfo.Readdata(query);

                if (res.Rows.Count == 1)
                {
                    UserDetails user = new UserDetails();

                    user.Name = res.Rows[0]["Name"].ToString();
                    user.Email = res.Rows[0]["Mailid"].ToString();
                    //user.DateofBirth = Convert.ToDateTime(res.Rows[0]["Dateofbirth"]);
                    user.UserId = int.Parse(res.Rows[0]["UserId"].ToString());
                    user.isRegisteredbyGmail = Convert.ToBoolean(res.Rows[0]["isRegisteredbyGmail"].ToString());
                    user.Age = int.Parse(res.Rows[0]["Age"].ToString());

                    return user;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Loghelper.Log("User", Log, Loghelper.Levels.ERROR, string.Format("{0}:{1}", MethodBase.GetCurrentMethod().ToString(), ex));
                return null;
            }
        }
        public async Task<int> RegisterUser(UserDetails user)
        {
            try
            {
                //user.DateofBirth = null;
                int isGmailuser = 0;
                if (user.isRegisteredbyGmail)
                {
                    isGmailuser = 1;
                }
                string query = "insert into RegisteredUserDetails values('" + user.Email + "','" + user.Password + "'," + isGmailuser + ",'" + user.Name + "','" + user.Age + "',null,null)";

                int statusOfUser = dbconnectionInfo.ExecuteNonQuery(CommandType.Text, query);
                if (Convert.ToBoolean(statusOfUser))
                {
                    return statusOfUser;
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
    }
}
