
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Set up the base URLs for development and production environments
string[] devBaseURL = { "http://localhost:3000" };
string[] prodBaseURL = { "https://kcurr.onrender.com", "https://kcurr-dev.onrender.com", "https://kcurr.azurewebsites.net/", "https://kcurr-backend.azurewebsites.net/" };
string[] allowedOrigins;

// Determind which baseURl should be used base on the environments
if (builder.Environment.IsDevelopment())
    allowedOrigins = devBaseURL;
else
    allowedOrigins = prodBaseURL;

// Configures CORS to allow requests from the specified origins with the specified headers and methods.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy  =>
        {
            policy.WithOrigins(allowedOrigins)
                .WithHeaders(HeaderNames.ContentType, "x-custom-header")
                .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
                .AllowCredentials();
        });
});

// Add services for controllers
builder.Services.AddControllers();

// Add support for making HTTP requests
builder.Services.AddHttpClient();

// Add support for memory cache
builder.Services.AddMemoryCache();

// Configure dependency injection for various services
builder.Services.AddSingleton<CurrService>();
builder.Services.AddSingleton<FinancialNewsService>();
builder.Services.AddSingleton<IExchangeRateApiClient, CurrencyBeaconApiClient>();
builder.Services.AddSingleton<IFinancialNewsApiClient, RapidApiApiClient>();
builder.Services.AddSingleton<ApiKeysProvider>();
 
var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("CORS Allowed Origins: {@CorsAllowedOrigins}", allowedOrigins);

app.MapGet("/", () => "Hello From KCURR-Backend!!!"); // Define a simple endpoint for the root URL

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS

app.UseCors(); // Enable CORS using the previously defined policy

app.UseAuthorization(); // Enable authorization (middleware)

app.MapControllers(); // Map controller routes

app.Run(); // Run the application