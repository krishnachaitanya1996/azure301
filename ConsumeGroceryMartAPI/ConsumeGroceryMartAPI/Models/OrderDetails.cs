using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsumeGroceryMartAPI.Models
{
    public class OrderDetails :Item
    {
        public int UserId { get; set; }
        // public string Itemid { get; set; }
        public int QuantityOrdered { get; set; }
        public string Address { get; set; }
        public string MailId { get; set; }
        // public string QuantityDescription { get; set; }
        // public string ItemName { get; set; }
        // public string Itemtype { get; set; }
        public string OderId { get; set; }
    }
}