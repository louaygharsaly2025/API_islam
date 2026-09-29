/// Base exception class for API_ISLAM client errors.
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic details;

  const ApiException(this.message, {this.statusCode, this.details});

  @override
  String toString() {
    if (statusCode != null) {
      return 'ApiException [$statusCode]: $message';
    }
    return 'ApiException: $message';
  }
}

class NetworkException extends ApiException {
  const NetworkException(super.message, {super.details});
}

class NotFoundException extends ApiException {
  const NotFoundException(super.message, {super.details}) : super(statusCode: 404);
}

class ValidationException extends ApiException {
  const ValidationException(super.message, {super.details}) : super(statusCode: 422);
}
