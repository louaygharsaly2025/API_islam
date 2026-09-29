/// Configuration options for the ApiIslam client.
class ApiIslamConfig {
  /// Base URL of the API_ISLAM backend instance.
  final String baseUrl;

  /// Request timeout duration.
  final Duration timeout;

  /// Custom HTTP headers.
  final Map<String, String> headers;

  const ApiIslamConfig({
    this.baseUrl = 'http://localhost:8000',
    this.timeout = const Duration(seconds: 15),
    this.headers = const {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  ApiIslamConfig copyWith({
    String? baseUrl,
    Duration? timeout,
    Map<String, String>? headers,
  }) {
    return ApiIslamConfig(
      baseUrl: baseUrl ?? this.baseUrl,
      timeout: timeout ?? this.timeout,
      headers: headers ?? this.headers,
    );
  }
}
