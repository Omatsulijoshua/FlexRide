import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../screens/auth/email_sign_in_screen.dart';
import '../../screens/auth/phone_otp_sign_in_screen.dart';
import '../../screens/auth/sign_in_screen.dart';
import '../../screens/auth/sign_up_screen.dart';
import '../../screens/auth/verify_pattern_screen.dart';
import '../../screens/home/home_screen.dart';
import '../../screens/splash_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutePaths.splash,
    routes: [
      GoRoute(
        path: AppRoutePaths.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutePaths.signIn,
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: AppRoutePaths.emailSignIn,
        builder: (context, state) => const EmailSignInScreen(),
      ),
      GoRoute(
        path: AppRoutePaths.phoneOtp,
        builder: (context, state) => const PhoneOtpSignInScreen(),
      ),
      GoRoute(
        path: AppRoutePaths.signUp,
        builder: (context, state) => const SignUpScreen(),
      ),
      GoRoute(
        path: AppRoutePaths.verifyPattern,
        builder: (context, state) => const VerifyPatternScreen(),
      ),
      GoRoute(
        path: AppRoutePaths.home,
        builder: (context, state) => const HomeScreen(),
      ),
    ],
  );
});

abstract final class AppRoutePaths {
  static const splash = '/';
  static const signIn = '/auth/sign-in';
  static const emailSignIn = '/auth/email';
  static const phoneOtp = '/auth/phone-otp';
  static const signUp = '/auth/sign-up';
  static const verifyPattern = '/auth/verify-pattern';
  static const home = '/home';
}
