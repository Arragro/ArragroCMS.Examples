using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using www.arragro.com.Models;

namespace www.arragro.com.Controllers
{
    public class ErrorController : Controller
    {
        private readonly MetaData _metaData404 = new MetaData("Not Found", "Content couldn't be found", "404 Not Found");
        private readonly MetaData _metaDataError = new MetaData("Error", "Something has gone wrong and we are investigating", "Error");

        [Route("error/{statusCode}")]
        public IActionResult Index(string statusCode)
        {
            switch (statusCode)
            {
                case "404":
                    ViewBag.MetaData = _metaData404;
                    return View("NotFound", ErrorPage.BuildNotFound());
                default:
                    ViewBag.MetaData = _metaDataError;
                    return View("NotFound", ErrorPage.BuildNotFound());
            }
        }

        [Route("error/exception")]
        public IActionResult Exception()
        {
            //var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            //if (exceptionFeature != null)
            //{
            //    // Get which route the exception occurred at
            //    string routeWhereExceptionOccurred = exceptionFeature.Path;

            //    // Get the exception that occurred
            //    var exceptionThatOccurred = exceptionFeature.Error;

            //    // TODO: Do something with the exception
            //    // Log it with Serilog?
            //    // Send an e-mail, text, fax, or carrier pidgeon?  Maybe all of the above?
            //    // Whatever you do, be careful to catch any exceptions, otherwise you'll end up with a blank page and throwing a 500
            //}
            ViewBag.MetaData = _metaDataError;
            return View("Index", ErrorPage.BuildError());
        }
    }
}