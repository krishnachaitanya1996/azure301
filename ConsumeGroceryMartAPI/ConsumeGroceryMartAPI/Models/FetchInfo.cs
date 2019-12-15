using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using System.Net.Http.Headers;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage;
using System.Net;
using Microsoft.ApplicationInsights;

namespace ConsumeGroceryMartAPI.Models
{
    public class FetchInfo
    {
        //const string URL_Prefix = "http://localhost:55463/";
        //const string URL_Prefix = "http://grocerymartapi20190130120506.azurewebsites.net/";
       const string URL_Prefix = "http://grocertmartapi.azurewebsites.net/";
        //const string azureFUnctionApp_URL = "http://localhost:7071/api/PostProduct";
        //const string azureFUnctionAppGet_URL = "http://localhost:7071/api/GetData";
        const string azureFUnctionApp_URL = "http://grocerymartfunctionapp.azurewebsites.net/api/PostProduct";
        const string azureFUnctionAppGet_URL = "https://grocerymartfunctionapp.azurewebsites.net/api/GetData";
        

        public async Task<T> APIGetCall<T>(string url) where T : new()
        {
            T list = new T();
            try
            {
                string apiUrl = URL_Prefix + url;           
                               
                HttpClient client = new HttpClient();

                client.BaseAddress = new Uri(apiUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response =  client.GetAsync(apiUrl).Result;
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();
                    
                    list = JsonConvert.DeserializeObject<T>(data);
                   
                }
                    return list;                
            }
            catch(Exception ex)
            {
                return list;
            }            
        }

        public async Task<T> APIGetCalluser<T>(string url) where T :new ()
        {
            T obj = new T();
            try
            {
                string apiUrl = URL_Prefix + url;

                HttpClient client = new HttpClient();

                client.BaseAddress = new Uri(apiUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = client.GetAsync(apiUrl).Result;
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();

                    obj = JsonConvert.DeserializeObject<T>(data);

                }
                return obj;
            }
            catch (Exception ex)
            {
                var telemetryClient = new TelemetryClient();

                telemetryClient.TrackException(ex);
                return obj;
            }
        }

        public bool PostData<T>(T oOjbect, string url)
        {
            try
            {
                HttpClient httpclient = new HttpClient();
                    string apiurl = URL_Prefix + url;
                    string JSON = JsonConvert.SerializeObject(oOjbect);
                    //StringContent content = new StringContent(JSON, Encoding.UTF8, $"application/json");
                    HttpContent httpContent = new StringContent(JSON, UnicodeEncoding.UTF8, "application/json");
                    httpclient.BaseAddress = new Uri(apiurl);
                    httpclient.DefaultRequestHeaders.Accept.Clear();
                    httpclient.DefaultRequestHeaders.ExpectContinue = false;
                    httpclient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 |
                    //                           SecurityProtocolType.Tls11 |
                    //                           SecurityProtocolType.Tls |
                    //                           SecurityProtocolType.Ssl3;



                    HttpResponseMessage msg = httpclient.PostAsync(apiurl, httpContent).Result;

                    msg.EnsureSuccessStatusCode();

                    return msg.IsSuccessStatusCode;                
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public string FetchImageFromBlob(String FileName)
        {           
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=blobstorage122;AccountKey=r4glNbhgt2JUbbGPgnRRkHuNj3vSPsaU1g+4y8tzZvoYVvqH26Q/caOwNdJbdzMu195s4nUtAZGG8MMY/06y5g==;EndpointSuffix=core.windows.net");

            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            
            CloudBlobContainer blobContainer = blobClient.GetContainerReference("imagesforgrocerymart"); //Container 

            CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference(FileName);// Gets File

            return blockBlob.Uri.AbsoluteUri;
        }
        public bool PostDataToAzureFunction<T>(T oOjbect, string url)
        {
            try
            {
                HttpClient httpclient = new HttpClient();
                string apiurl = azureFUnctionApp_URL;
                string JSON = JsonConvert.SerializeObject(oOjbect);
                //StringContent content = new StringContent(JSON, Encoding.UTF8, $"application/json");
                HttpContent httpContent = new StringContent(JSON, UnicodeEncoding.UTF8, "application/json");
                httpclient.BaseAddress = new Uri(apiurl);
                httpclient.DefaultRequestHeaders.Accept.Clear();
                //httpclient.DefaultRequestHeaders.ExpectContinue = false;
                httpclient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                
                HttpResponseMessage msg = httpclient.PostAsync(apiurl, httpContent).Result;

                msg.EnsureSuccessStatusCode();

                return msg.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<T> APIGetCallFromAzureFunction<T>(string url) where T : new()
        {
            T list = new T();
            try
            {
                string apiUrl = azureFUnctionAppGet_URL;

                HttpClient client = new HttpClient();

                client.BaseAddress = new Uri(apiUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = client.GetAsync(apiUrl).Result;
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();

                    list = JsonConvert.DeserializeObject<T>(data);

                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }
        }

    }
}