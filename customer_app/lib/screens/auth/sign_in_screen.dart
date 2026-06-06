import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'sign_up_screen.dart';
import 'email_sign_in_screen.dart';
import 'phone_otp_sign_in_screen.dart';
import '../home/home_screen.dart';

class SignInScreen extends StatelessWidget {
  const SignInScreen({super.key});

  Future<void> _loginAndNavigate(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLoggedIn', true);

    if (!context.mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Welcome Back',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const EmailSignInScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.email),
                label: const Text('Sign in with Email'),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const PhoneOtpSignInScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.phone),
                label: const Text('Sign in with Phone OTP'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => _loginAndNavigate(context),
                icon: const Icon(Icons.g_mobiledata, size: 32),
                label: const Text('Sign in with Google'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => _loginAndNavigate(context),
                icon: const Icon(Icons.apple),
                label: const Text('Sign in with Apple'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => _loginAndNavigate(context),
                icon: const Icon(Icons.facebook),
                label: const Text('Sign in with Facebook'),
              ),
              const Spacer(),
              TextButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const SignUpScreen()),
                  );
                },
                child: const Text('Not registered yet? Sign up'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
