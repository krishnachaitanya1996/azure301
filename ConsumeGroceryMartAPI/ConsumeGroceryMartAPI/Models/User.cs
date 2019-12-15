using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ConsumeGroceryMartAPI.Models
{
    public class User
    {
        [Required]
        [DisplayName("Name")]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public int Age { get; set; }
        [Required]
        public DateTime DateofBirth { get; set; }
        
        public int UserId { get; set; }
        [DisplayName("User Registered by Gmail")]
        public bool isRegisteredbyGmail { get; set; }
        [Required]
        public string password { get; set; }
    }
}