using System.Text.Json;

namespace backend.Utilities;

public class JsonSeedFilesReader
{
	public JsonSeedFilesReader()
	{

    }

    /// <summary>
    /// Attempting to retrieved curr data from seeding files instead of requesting the actual api data, in order to prevent the api key run out of quota.
    /// This function only works with DotNET debugging mode, not on docker. This is becuase the dockerized app cannot access files out, such as project root dir
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="relativePath"></param>
    /// <returns></returns>
    public static async Task<T> ReadCurrFromJson<T>(string relativePath)
    {
        try
        {
            string basePath = GetProjectRootPath() + "/SeedFiles";
            string filePath = basePath + relativePath;
            // Read the JSON file asynchronously
            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                // Deserialize the JSON content to CurrencyBeaconTimeSeriesApiResponse
                var apiResponse = await JsonSerializer.DeserializeAsync<T>(stream);
                return apiResponse;
            }
        }
        catch (Exception ex)
        {
            // Handle or log the exception as needed
            Console.WriteLine($"An error occurred while reading or deserializing the JSON file: {ex.Message}");
            return default(T);
        }
    }

    /// <summary>
    /// Getting relative file path to access static json seed file for development environtment only
    /// </summary>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    public static string GetProjectRootPath()
    {
        var baseDirectory = AppContext.BaseDirectory;
        var currentDirectory = new DirectoryInfo(baseDirectory);

        // Traverse up the directory structure to find the project root (assuming typical bin/Debug or bin/Release structure)
        while (currentDirectory != null && currentDirectory.Name != "bin")
        {
            currentDirectory = currentDirectory.Parent;
        }

        // If found, move one directory up to the project root
        if (currentDirectory != null)
        {
            return currentDirectory.Parent.FullName;
        }

        throw new InvalidOperationException("Could not determine the project root directory.");
    }
}

