import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'https://flexride-backend.onrender.com'; // Production API Gateway
  final Dio _dio = Dio(BaseOptions(baseUrl: baseUrl));

  ApiClient() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Auto-inject JWT token from Phase 4 Auth Service
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('jwt_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
      ),
    );
  }

  Dio get client => _dio;

  // Example API Gateway calls targeting microservices:
  // _dio.post('/driver/kyc/verify') -> Routes to Driver Service (Port 3003)
  // _dio.post('/tracking/location') -> Over WebSocket (Port 3005)
}
