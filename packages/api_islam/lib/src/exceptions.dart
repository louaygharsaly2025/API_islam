/// Base exception class for API_ISLAM client errors.
class ApiException implements Exception {
  /// The error message returned or generated.
  final String message;

  /// The HTTP status code, if available.
  final int? statusCode;

  /// Additional error details or server response.
  final dynamic details;

  /// Creates a generic [ApiException].
  const ApiException(this.message, {this.statusCode, this.details});

  @override
  String toString() {
    if (statusCode != null) {
      return 'ApiException [$statusCode]: $message';
    }
    return 'ApiException: $message';
  }
}

/// Thrown when a network failure, socket error, or timeout occurs.
class NetworkException extends ApiException {
  /// Creates a [NetworkException].
  const NetworkException(super.message, {super.details});
}

/// Thrown when a requested resource is not found (HTTP 404).
class NotFoundException extends ApiException {
  /// Creates a [NotFoundException].
  const NotFoundException(super.message, {super.details}) : super(statusCode: 404);
}

/// Thrown when input validation fails (HTTP 422).
class ValidationException extends ApiException {
  /// Creates a [ValidationException].
  const ValidationException(super.message, {super.details}) : super(statusCode: 422);
}
