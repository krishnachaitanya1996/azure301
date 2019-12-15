using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsumeGroceryMartAPI.Models
{
    public class Item
    {
        public string Itemid { get; set; }
        public string ItemType { get; set; }

        public int ItemTypeId { get; set; }
        public string Description { get; set; }
        public string Rating { get; set; }

        public float Price { get; set; }
        public int Quantity { get; set; }

        public string QuantityType { get; set; }

        public int QuantityTypeId { get; set; }

        public string Itemname { get; set; }

        public string ImagePath { get; set; }
        public HttpPostedFile ImageFile { get; set; }
    }
}