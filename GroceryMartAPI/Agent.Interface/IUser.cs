using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity;

namespace Agent.Interface
{
    public interface IUser
    {
        Task<IEnumerable<GmailUser>> getUser();

        Task<UserDetails> ValidateUser(string Email, string password);

        Task<int> RegisterUser(UserDetails user);
    }
}
