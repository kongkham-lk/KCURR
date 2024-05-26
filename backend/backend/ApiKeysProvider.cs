using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

namespace backend;

public class ApiKeysProvider
{
    private IConfiguration? _apiKeysConfiguration;
    private ILogger<ApiKeysProvider> _logger;


    public enum ApiName
    {
        Config_CurrencyBeaconApiKey,
        Config_CurrencyApiApiKey,
        Config_CloudMersiveApiKey,
        Config_RapidApiApiKey
    }

    public ApiKeysProvider(ILogger<ApiKeysProvider> logger)
    {
        _apiKeysConfiguration = ReadApiKeysFromJson();
        _logger = logger;
    }

    public string? GetApiKey(ApiName apiName)
    {
        if (_apiKeysConfiguration is null)
            return "";

        string targetApiKey = "";

        if (apiName == ApiName.Config_CurrencyBeaconApiKey)
            targetApiKey = _apiKeysConfiguration[ApiName.Config_CurrencyBeaconApiKey.ToString()];
        else if (apiName == ApiName.Config_CurrencyApiApiKey)
            targetApiKey = _apiKeysConfiguration[ApiName.Config_CurrencyApiApiKey.ToString()];
        else if (apiName == ApiName.Config_CloudMersiveApiKey)
            targetApiKey = _apiKeysConfiguration[ApiName.Config_CloudMersiveApiKey.ToString()];
        else if (apiName == ApiName.Config_RapidApiApiKey)
            targetApiKey = _apiKeysConfiguration[ApiName.Config_RapidApiApiKey.ToString()];

        // apiKeys is retrieve from appsettings.ApiKeys.json where is located under appsettings.json
        _logger.LogInformation($"Returning Key: {apiName}, Value: {targetApiKey}!!!");
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