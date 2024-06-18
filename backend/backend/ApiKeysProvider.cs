namespace backend;

public class ApiKeysProvider
{
    private IConfiguration? _apiKeysConfiguration;
    private ILogger<ApiKeysProvider> _logger;
    private IWebHostEnvironment _env;
    private string CurrentKey { get; set; } = "";
    private List<string> FailKeyList { get; set; } = new();

    public enum ApiName
    {
        CurrencyBeaconApiKey,
        CurrencyApiApiKey,
        RapidApiApiKey
    }

    public ApiKeysProvider(ILogger<ApiKeysProvider> logger, IWebHostEnvironment env)
    {
        // Determined on how to retrieve API key
        // if in developement env. then grab all the api keys from AppSettings.json, else grab from environment variable instead.
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

        string? targetApiKey = "";

        DateTime currentTime = DateTime.Now;
        int currentSecond = currentTime.Second;
        int num = (Convert.ToInt32(currentSecond) % 10) % 3; // use different api key based on time (second) since each api has monthly quota

        // is not empty mean the prev key is fail key (no quota left to retrieve data)
        if (CurrentKey != "" && !FailKeyList.Any(key => key.Equals(CurrentKey)))
            FailKeyList.Add(CurrentKey);

        string baseApiName = apiName.ToString() + (_env.IsDevelopment() ? ":" : "");
        string keysLengthIndex = baseApiName + "TotalKey";
        CurrentKey = baseApiName + num;

        int backupKeyLength = _env.IsDevelopment() ?
            Convert.ToInt16(_apiKeysConfiguration?[keysLengthIndex]) :
            Convert.ToInt16(Environment.GetEnvironmentVariable(keysLengthIndex));

        while (FailKeyList.Any(key => key.Equals(CurrentKey))
            && FailKeyList.Select(key => key.Contains(apiName.ToString())).Count() < backupKeyLength)
        {
            // in case there is no next backup key, thus need to reset
            if (num + 1 > backupKeyLength)
                num++;
            else
                num = 0;

            CurrentKey = baseApiName + num;
        }

        targetApiKey = _env.IsDevelopment() ? _apiKeysConfiguration?[CurrentKey] : Environment.GetEnvironmentVariable(CurrentKey);

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