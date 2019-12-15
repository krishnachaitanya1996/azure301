using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity;

namespace Agent.Interface
{
    public interface IFetchItemDetails
    {
        Task<IEnumerable<ItemTypeData>> getItemTypes();

        Task<IEnumerable<QuantityUnitsDetails>> getQuantityTypes();

        int postItem(Item item);

        Task<IEnumerable<Item>> getAllItem();
        Task<IEnumerable<OrderDetails>> getAllOrderDetails(int id);

        Task<IEnumerable<Item>> getAllProductsFor(int ProductTypeId);

    }
}
