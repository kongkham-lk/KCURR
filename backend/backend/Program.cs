
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:3000")
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
 
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();