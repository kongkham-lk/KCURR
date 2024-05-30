using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using System;

namespace backend;

public class ApiKeysProvider
{
    private IConfiguration? _apiKeysConfiguration;
    private ILogger<ApiKeysProvider> _logger;
    private IWebHostEnvironment _env;


    public enum ApiName
    {
        CurrencyBeaconApiKey,
        CurrencyApiApiKey,
        RapidApiApiKey
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
        if (apiName == ApiName.CurrencyApiApiKey)
            //targetApiKey = _apiKeysConfiguration[ApiName.Config_CurrencyApiApiKey.ToString()];
            targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[ApiName.CurrencyApiApiKey.ToString()] : Environment.GetEnvironmentVariable(ApiName.CurrencyApiApiKey.ToString());
        else // use different api key based on time (second) since each api has monthly quota
        {
            DateTime currentTime = DateTime.Now;
            int currentSecond = currentTime.Second;
            int num = (Convert.ToInt32(currentSecond) % 10) % 3;

            if (apiName == ApiName.CurrencyBeaconApiKey)
                targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[$"{ApiName.CurrencyBeaconApiKey.ToString()}:{num}"] : Environment.GetEnvironmentVariable(ApiName.CurrencyBeaconApiKey.ToString() + num);
            else if (apiName == ApiName.RapidApiApiKey)
                targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration[$"{ApiName.RapidApiApiKey.ToString()}:{num}"] : Environment.GetEnvironmentVariable(ApiName.RapidApiApiKey.ToString() + num);
        }

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