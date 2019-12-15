using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class UserDetails
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public DateTime DateofBirth { get; set; }        
        public int UserId { get; set; }
        public bool isRegisteredbyGmail { get; set; }
        public string Password { get; set; }

    }
}
