
using backend;
using backend.ApiClients.CurrencyBeacon;
using backend.ApiClients.RapidApi;
using backend.Interfaces;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

var devBaseURL = "http://localhost:3000";
var prodBaseURL = "https://kcurr.onrender.com";
var corsAllowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy  =>
        {
            policy.WithOrigins(corsAllowedOrigins)
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

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("CORS Allowed Origins: {@CorsAllowedOrigins}", corsAllowedOrigins);

app.MapGet("/", () => "Hello From KCURR-Backend!!!");

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();