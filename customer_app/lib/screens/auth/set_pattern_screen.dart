import 'package:flutter/material.dart';
import 'package:pattern_lock/pattern_lock.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SetPatternScreen extends StatefulWidget {
  const SetPatternScreen({super.key});

  @override
  State<SetPatternScreen> createState() => _SetPatternScreenState();
}

class _SetPatternScreenState extends State<SetPatternScreen> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(title: const Text('Set Pattern Lock')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Draw your unlock pattern',
            style: TextStyle(fontSize: 20),
          ),
          const SizedBox(height: 32),
          SizedBox(
            height: 400,
            child: PatternLock(
              selectedColor: Colors.blue,
              pointRadius: 8,
              showInput: true,
              dimension: 3,
              relativePadding: 0.7,
              selectThreshold: 25,
              fillPoints: true,
              onInputComplete: (List<int> input) async {
                if (input.length < 4) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Pattern must be at least 4 dots'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                final prefs = await SharedPreferences.getInstance();
                await prefs.setString('savedPattern', input.join(','));

                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Pattern saved successfully!'),
                    backgroundColor: Colors.green,
                  ),
                );
                Navigator.of(context).pop();
              },
            ),
          ),
        ],
      ),
    );
  }
}
