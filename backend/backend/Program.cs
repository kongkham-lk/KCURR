
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

var baseURL = "http://localhost:3000";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.AllowCredentials()
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
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