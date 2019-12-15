using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agent.Interface
{
    public interface IOrderProduct
    {
        Task<int> PlaceOrder(OrderProducts product);
    }
}
