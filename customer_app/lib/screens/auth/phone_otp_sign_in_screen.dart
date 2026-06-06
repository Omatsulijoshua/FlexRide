import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../services/api_client.dart';
import '../home/home_screen.dart';

class PhoneOtpSignInScreen extends StatefulWidget {
  const PhoneOtpSignInScreen({super.key});

  @override
  State<PhoneOtpSignInScreen> createState() => _PhoneOtpSignInScreenState();
}

class _PhoneOtpSignInScreenState extends State<PhoneOtpSignInScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _isLoading = false;
  bool _otpRequested = false;

  Future<void> _requestOtp() async {
    if (_phoneController.text.trim().isEmpty) {
      _showError('Enter your phone number');
      return;
    }

    setState(() => _isLoading = true);
    try {
      await ApiClient().client.post(
        '/auth/phone-otp/request',
        data: {'phoneNumber': _phoneController.text.trim()},
      );
      if (!mounted) return;
      setState(() => _otpRequested = true);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('OTP sent')));
    } on DioException catch (e) {
      _showError(e.response?.data?['message'] ?? 'Unable to send OTP');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyOtp() async {
    if (_otpController.text.trim().length != 6) {
      _showError('Enter the 6 digit OTP');
      return;
    }

    setState(() => _isLoading = true);
    try {
      final response = await ApiClient().client.post(
        '/auth/phone-otp/verify',
        data: {
          'phoneNumber': _phoneController.text.trim(),
          'otp': _otpController.text.trim(),
        },
      );

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', response.data['access_token']);
      await prefs.setBool('isLoggedIn', true);

      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
        (route) => false,
      );
    } on DioException catch (e) {
      _showError(e.response?.data?['message'] ?? 'Invalid OTP');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Phone OTP')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Sign in with Phone OTP',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 32),
              TextField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Phone number',
                  prefixIcon: Icon(Icons.phone),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16),
              if (_otpRequested)
                TextField(
                  controller: _otpController,
                  decoration: const InputDecoration(
                    labelText: 'OTP',
                    prefixIcon: Icon(Icons.password),
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : (_otpRequested ? _verifyOtp : _requestOtp),
                child: Text(_otpRequested ? 'Verify OTP' : 'Send OTP'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
