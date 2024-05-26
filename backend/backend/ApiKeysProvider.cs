using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

namespace backend;

public class ApiKeysProvider
{
    private IConfiguration? _apiKeysConfiguration;
    private ILogger<ApiKeysProvider> _logger;
    private IWebHostEnvironment _env;


    public enum ApiName
    {
        Config_CurrencyBeaconApiKey,
        Config_CurrencyApiApiKey,
        Config_CloudMersiveApiKey,
        Config_RapidApiApiKey
    }

    public ApiKeysProvider(ILogger<ApiKeysProvider> logger, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
            _apiKeysConfiguration = ReadApiKeysFromJson();
        _logger = logger;
        _env = env;
    }

    public string? GetApiKey(ApiName apiName)
    {
        if (_env.IsDevelopment() && _apiKeysConfiguration is null)
        {
            _logger.LogInformation($"Receive null APIs key from !!!");
            return "";
        }

        string targetApiKey = "";

        // Determined on how to retrieve API key
        // if in developement env. then grab from AppSettings.json, else grab from environment variable instead.
        if (apiName == ApiName.Config_CurrencyBeaconApiKey)
            targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[ApiName.Config_CurrencyBeaconApiKey.ToString()] : Environment.GetEnvironmentVariable(ApiName.Config_CurrencyBeaconApiKey.ToString());
        else if (apiName == ApiName.Config_CurrencyApiApiKey)
            //targetApiKey = _apiKeysConfiguration[ApiName.Config_CurrencyApiApiKey.ToString()];
            targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[ApiName.Config_CurrencyApiApiKey.ToString()] : Environment.GetEnvironmentVariable(ApiName.Config_CurrencyApiApiKey.ToString());
        else if (apiName == ApiName.Config_CloudMersiveApiKey)
            targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[ApiName.Config_CloudMersiveApiKey.ToString()] : Environment.GetEnvironmentVariable(ApiName.Config_CloudMersiveApiKey.ToString());
        else if (apiName == ApiName.Config_RapidApiApiKey)
            targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[ApiName.Config_RapidApiApiKey.ToString()] : Environment.GetEnvironmentVariable(ApiName.Config_RapidApiApiKey.ToString());


        //_logger.LogInformation($"Returning Key: {apiName}, Value: {targetApiKey}!!!"); // Logging API key retrieving result

        // apiKeys is retrieve from appsettings.ApiKeys.json where is located under appsettings.json
        return targetApiKey;
    }

    private IConfiguration? ReadApiKeysFromJson()
    {
        IConfiguration? configuration = null;
        try
        {
            configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.ApiKeys.json")
                .AddEnvironmentVariables(prefix: "Config_")
                .Build();
            return configuration;
        }
        catch (FileNotFoundException)
        {
            // Handle the case where apiKeys.json is not found
        }
        return configuration;
    }

}