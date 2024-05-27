
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

var devBaseURL = new string[] { "http://localhost:3000" };
var prodBaseURL = new string[]
{
    "https://kcurr.onrender.com",
};
string[] allowedOrigins = new string[] { };

if (builder.Environment.IsDevelopment())
    allowedOrigins = devBaseURL;
else
    allowedOrigins = prodBaseURL;

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

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<CurrService>();
builder.Services.AddSingleton<FinancialNewsService>();
builder.Services.AddSingleton<IExchangeRateApiClient, CurrencyBeaconApiClient>();
builder.Services.AddSingleton<IFinancialNewsApiClient, RapidApiApiClient>();
builder.Services.AddSingleton<ApiKeysProvider>();
 
var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("CORS Allowed Origins: {@CorsAllowedOrigins}", allowedOrigins);

app.MapGet("/", () => "Hello From KCURR-Backend!!!");

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();