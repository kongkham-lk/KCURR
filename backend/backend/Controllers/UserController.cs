using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace backend.Controllers;

[ApiController]
public class UserController : ControllerBase
{
	private readonly IMemoryCache _cache;

	public UserController(IMemoryCache cache)
	{
		_cache = cache;
	}

    [HttpGet("preferences/{userId}")]
    public Preferences GetPreferences(string userId)
    {
        if (_cache.TryGetValue(userId, out string preferences))
        {
            return JsonConvert.DeserializeObject<Preferences>(preferences);
        }
        return new Preferences
        {
            Theme = "color",
            ConvertedCurrPair = new string[2] { "USD", "THB" },
            LiveRateCurrCodes = new List<string> { "USD", "CAD", "EUR", "GBP" },
            NewsCategories = new List<string> { "Business", "Finance", "Bank", "Investment" },
        };
    }

    [HttpPost("update-preferences/{userId}")]
    public void SetPreferences(string userId, [FromBody] Preferences preferences)
    {
        _cache.Set(userId, JsonConvert.SerializeObject(preferences), new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(365)
        });
    }
}

