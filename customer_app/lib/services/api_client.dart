import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'https://flexride-api.onrender.com'; // Production API Gateway
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
  // _dio.post('/auth/login') -> Routes to Auth Service (Port 3001)
  // _dio.get('/users/profile') -> Routes to User Service (Port 3002)
  // _dio.post('/rides/request') -> Routes to Ride Engine (Port 3004)
}
