using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace backend;

public class ApiKeysProvider
{
    private Dictionary<string, string> _apiKeys;

    public enum ApiName
    {
        CurrencyBeaconApiKey,
        CurrencyApiApiKey,
        CloudMersiveApiKey,
        RapidApiApiKey
    }

    public ApiKeysProvider()
    {
        _apiKeys = ReadApiKeysFromJson();
    }

    public string GetApiKey(ApiName apiName)
    {
        string targetApiName = null;
        if (apiName == ApiName.CurrencyBeaconApiKey)
            targetApiName = "CurrencyBeaconApiKey";
        else if (apiName == ApiName.CurrencyApiApiKey)
            targetApiName = "CurrencyApiApiKey";
        else if (apiName == ApiName.CloudMersiveApiKey)
            targetApiName = "CloudMersiveApiKey";
        else if (apiName == ApiName.RapidApiApiKey)
            targetApiName = "RapidApiApiKey";
        return _apiKeys[targetApiName];
    }

    private Dictionary<string, string> ReadApiKeysFromJson()
    {
        var apiKeys = new Dictionary<string, string>();

        try
        {
            using (StreamReader file = File.OpenText("apiKeys.json"))
            {
                using (JsonTextReader reader = new JsonTextReader(file))
                {
                    JObject json = (JObject)JToken.ReadFrom(reader);
                    foreach (var property in json.Properties())
                    {
                        apiKeys[property.Name] = property.Value.ToString();
                    }
                }
            }
        }
        catch (FileNotFoundException)
        {
            // Handle the case where apiKeys.json is not found
        }
        return apiKeys;
    }

}