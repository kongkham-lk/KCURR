
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

var devBaseURL = "http://localhost:3000";
var prodBaseURL = "https://kcurr.onrender.com";

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy  =>
        {
            policy.WithOrigins(new string[] { devBaseURL, prodBaseURL })
                .SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyMethod()
                .AllowAnyHeader()
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

app.UseHttpsRedirection();

app.MapGet("/", () => "Hello From KCURR-Backend!!!");

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();