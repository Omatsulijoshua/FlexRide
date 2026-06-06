import 'package:flutter/material.dart';
import 'package:pattern_lock/pattern_lock.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../home/home_screen.dart';
import 'sign_in_screen.dart';

class VerifyPatternScreen extends StatefulWidget {
  const VerifyPatternScreen({super.key});

  @override
  State<VerifyPatternScreen> createState() => _VerifyPatternScreenState();
}

class _VerifyPatternScreenState extends State<VerifyPatternScreen> {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  bool isError = false;

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLoggedIn', false);
    await prefs.remove('savedPattern');

    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const SignInScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(),
            Text(
              isError
                  ? 'Incorrect pattern. Try again.'
                  : 'Draw pattern to unlock',
              style: TextStyle(
                fontSize: 20,
                color: isError ? Colors.red : Colors.black,
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              height: 400,
              child: PatternLock(
                selectedColor: isError ? Colors.red : Colors.blue,
                pointRadius: 8,
                showInput: true,
                dimension: 3,
                relativePadding: 0.7,
                selectThreshold: 25,
                fillPoints: true,
                onInputComplete: (List<int> input) async {
                  final prefs = await SharedPreferences.getInstance();
                  final savedPatternStr = prefs.getString('savedPattern');

                  if (savedPatternStr == input.join(',')) {
                    if (!context.mounted) return;
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const HomeScreen()),
                    );
                  } else {
                    setState(() {
                      isError = true;
                    });

                    // Reset error state after a brief delay
                    Future.delayed(const Duration(seconds: 1), () {
                      if (mounted) {
                        setState(() {
                          isError = false;
                        });
                      }
                    });
                  }
                },
              ),
            ),
            const Spacer(),
            TextButton(
              onPressed: _logout,
              child: const Text('Forgot Pattern? Sign Out'),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
