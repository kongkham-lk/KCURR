
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Set up the base URLs for development and production environments
string devBaseURL = "http://localhost:3000";
string prodBaseURL = "https://kcurr.onrender.com";
string allowedOrigins = "";

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

// Add services for controllers with views
builder.Services.AddControllersWithViews();

// Add support for making HTTP requests
builder.Services.AddHttpClient();

// Configure dependency injection for various services
builder.Services.AddSingleton<CurrService>();
builder.Services.AddSingleton<FinancialNewsService>();
builder.Services.AddSingleton<IExchangeRateApiClient, CurrencyBeaconApiClient>();
builder.Services.AddSingleton<IFinancialNewsApiClient, RapidApiApiClient>();
builder.Services.AddSingleton<ApiKeysProvider>();
 
var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error"); // Use custom error page in production
    app.UseHsts(); // Enable HSTS (HTTP Strict Transport Security) in production
}

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("CORS Allowed Origins: {@CorsAllowedOrigins}", allowedOrigins);

app.MapGet("/", () => "Hello From KCURR-Backend!!!"); // Define a simple endpoint for the root URL

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS

app.UseCors(); // Enable CORS using the previously defined policy

app.UseStaticFiles(); // Serve static files

app.UseRouting(); // Enable routing

app.UseAuthorization(); // Enable authorization (middleware)

app.MapControllers(); // Map controller routes

// Serve the index.html file for all unknown routes to support client-side routing in a SPA
app.MapFallbackToFile("index.html");

app.Run(); // Run the application