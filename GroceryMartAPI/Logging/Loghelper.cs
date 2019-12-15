using log4net;
using Microsoft.ApplicationInsights;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logging
{
    public static class Loghelper
    {

       // public static readonly bool EnableDetailLog = ConfigurationManager.AppSettings["EnableDetailLog"].ToBool();

        public enum Levels
        {
            INFO = 1,
            DEBUG = 2,
            WARN = 3,
            ERROR = 4,
            FATAL = 5,
        }


        public static void Log(ILog logDetail, Levels level, string message)
        {
            string user = GetDefaultUser();
            Log(user, logDetail, level, message);
        }

       
        public static void Log(string user, ILog logDetail, Levels level, string message)
        {
            var telemetryClient = new TelemetryClient();

            telemetryClient.TrackException(new Exception());
            //telemetryClient.

            FileInfo fi = new FileInfo("log4net.config");
            log4net.Config.XmlConfigurator.Configure(fi);
            log4net.GlobalContext.Properties["host"] = Environment.MachineName;

            var logInfo = PrepareLogData(user, message);

            switch (level)
            {
                case Levels.INFO:
                    logDetail.Info(logInfo);
                    break;

                case Levels.DEBUG:                   
                        logDetail.Debug(logInfo);
                    break;

                case Levels.WARN:
                    logDetail.Warn(logInfo);
                    break;

                case Levels.ERROR:
                    logDetail.Error(logInfo);
                    break;

                case Levels.FATAL:
                    logDetail.Fatal(logInfo);
                    break;
            }
        }

      
        public static void Log(string user, ILog logDetail, Levels level, string message, string methodName)
        {
            var logInfo = PrepareLogData(user, message, methodName);

            switch (level)
            {
                case Levels.INFO:
                    logDetail.Info(logInfo);
                    break;

                case Levels.DEBUG:                   
                        logDetail.Debug(logInfo);
                    break;

                case Levels.WARN:
                    logDetail.Warn(logInfo);
                    break;

                case Levels.ERROR:
                    logDetail.Error(logInfo);
                    break;

                case Levels.FATAL:
                    logDetail.Fatal(logInfo);
                    break;
            }
        }

        private static string PrepareLogData(string user, string message, string methodName)
        {
            user = GetDefaultUser();

            var logContent = new StringBuilder();

            logContent.AppendFormat("UserId:{0} \n Method:{1} \n {2} \n", user, methodName, message);
            return logContent.ToString();
        }

     
        private static string PrepareLogData(string user, string message)
        {

            user = GetDefaultUser();
            var logContent = new StringBuilder();

            logContent.AppendFormat("UserId:{0} \n {1} \n", user, message);

            return logContent.ToString();
        }

        private static string GetDefaultUser()
        {
            return "";
        }
    }
}
