﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsumeGroceryMartAPI.Models
{
    public class OrderProducts
    {
        public string Itemid { get; set; }

        public string Quantity { get; set; }

        public string UserId { get; set; }

        public string address { get; set; }
    }
}