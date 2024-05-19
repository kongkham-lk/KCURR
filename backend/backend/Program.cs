
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

var devBaseURL = "http://localhost:3000";
var prodBaseURL = "https://kcurr.onrender.com";

var origins = new string[] { devBaseURL, prodBaseURL };
var methods = new string[] { "GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "CONNECT", "TRACE" };
var headers = new string[] { "Content-Type", "Authorization", "X-Content-Type-Options", "Accept", "X-Requested-With", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins(origins)
                .WithMethods(methods)
                .WithHeaders(headers);
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

app.MapGet("/", () => "Hello From KCURR-Backend!!!");

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();