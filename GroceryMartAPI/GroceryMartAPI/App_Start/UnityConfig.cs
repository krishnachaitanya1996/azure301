using System.Web.Http;
using Unity;
using Unity.WebApi;
using Agent;
using Agent.Interface;
using Repository.Interface;
using Repository;

namespace GroceryMartAPI
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            container.RegisterType<IUser, User>();
            container.RegisterType<IFetchItemDetails, FetchItemDetails>();
            container.RegisterType<IDBConnectionInfo, DBConnectionInfo>();
            container.RegisterType<IOrderProduct, OrderProduct>();

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}