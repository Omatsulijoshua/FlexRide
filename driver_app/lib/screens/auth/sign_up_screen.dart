import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'email_sign_up_screen.dart';
import '../home/home_screen.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({super.key});

  Future<void> _signUpAndNavigate(BuildContext context) async {
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
      appBar: AppBar(title: const Text('Sign Up')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Create an Account',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const EmailSignUpScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.email),
                label: const Text('Sign up with Email'),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => _signUpAndNavigate(context),
                icon: const Icon(Icons.phone),
                label: const Text('Sign up with Phone Number'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => _signUpAndNavigate(context),
                icon: const Icon(Icons.g_mobiledata, size: 32),
                label: const Text('Sign up with Google'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => _signUpAndNavigate(context),
                icon: const Icon(Icons.apple),
                label: const Text('Sign up with Apple'),
              ),
              const Spacer(),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('Already registered? Sign in'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
