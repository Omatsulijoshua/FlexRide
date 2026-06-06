import 'package:flutter/material.dart';
import 'dart:math';
import '../../services/api_client.dart';
import 'waiting_for_driver_screen.dart';

class RideBookingScreen extends StatefulWidget {
  const RideBookingScreen({super.key});

  @override
  State<RideBookingScreen> createState() => _RideBookingScreenState();
}

class _RideBookingScreenState extends State<RideBookingScreen> {
  final _pickupController = TextEditingController(text: "123 Main St");
  final _dropoffController = TextEditingController(text: "456 Market St");
  bool _isLoading = false;
  final String _estimatedFare = "NGN 4,500"; // Mock fare

  Future<void> _requestRide() async {
    setState(() => _isLoading = true);

    try {
      final client = ApiClient().client;
      final response = await client.post(
        '/rides',
        data: {
          'customerId': 'cust_${Random().nextInt(10000)}', // Mock ID
          'pickupLocation': {
            'address': _pickupController.text,
            'lat': 6.52,
            'lng': 3.37,
          },
          'dropoffLocation': {
            'address': _dropoffController.text,
            'lat': 6.60,
            'lng': 3.40,
          },
          'serviceType': 'standard',
        },
      );

      if (!mounted) return;
      if (response.data['success'] == true) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) =>
                WaitingForDriverScreen(rideId: response.data['rideId']),
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to request ride: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book a Ride')),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Container(
                color: Colors.grey.shade200,
                child: Center(
                  child: Icon(
                    Icons.map,
                    size: 100,
                    color: Colors.grey.shade400,
                  ),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(24),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _pickupController,
                    decoration: const InputDecoration(
                      labelText: 'Pickup Location',
                      prefixIcon: Icon(Icons.my_location, color: Colors.blue),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _dropoffController,
                    decoration: const InputDecoration(
                      labelText: 'Dropoff Location',
                      prefixIcon: Icon(Icons.location_on, color: Colors.red),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Estimated Fare:',
                        style: TextStyle(fontSize: 16, color: Colors.black54),
                      ),
                      Text(
                        _estimatedFare,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _requestRide,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text(
                            'CONFIRM RIDE',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
