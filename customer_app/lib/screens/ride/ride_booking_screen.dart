import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
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
  double? _systemFare;
  double? _offeredFare;
  String _errorMsg = '';

  Future<void> _calculateFare() async {
    setState(() {
      _isLoading = true;
      _errorMsg = '';
    });
    
    try {
      final client = ApiClient().client;
      // We will hit the estimate endpoint to get the system price
      final response = await client.post('/rides/estimate', data: {
        'customerId': 'cust_${Random().nextInt(10000)}',
        'pickupAddress': _pickupController.text,
        'pickupLat': 6.52,
        'pickupLng': 3.37,
        'dropoffAddress': _dropoffController.text,
        'dropoffLat': 6.60,
        'dropoffLng': 3.40,
        'category': 'ECONOMY'
      });

      if (!mounted) return;
      setState(() {
        _systemFare = response.data['totalFare']?.toDouble() ?? 4500.0;
        _offeredFare = _systemFare; // Default slider to system fare
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _errorMsg = 'Failed to calculate fare: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _requestRide() async {
    setState(() => _isLoading = true);
    
    try {
      final client = ApiClient().client;
      final response = await client.post('/rides', data: {
        'customerId': 'cust_${Random().nextInt(10000)}',
        'pickupAddress': _pickupController.text,
        'pickupLat': 6.52,
        'pickupLng': 3.37,
        'dropoffAddress': _dropoffController.text,
        'dropoffLat': 6.60,
        'dropoffLng': 3.40,
        'category': 'ECONOMY',
        'offeredFare': _offeredFare,
      });

      if (!mounted) return;
      if (response.data['success'] == true) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) => WaitingForDriverScreen(rideId: response.data['rideId']),
          ),
        );
      }
    } on DioException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to request: ${e.response?.data?['message'] ?? e.message}'), backgroundColor: Colors.red),
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
                  child: Icon(Icons.map, size: 100, color: Colors.grey.shade400),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -5))],
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
                  const SizedBox(height: 16),
                  
                  if (_errorMsg.isNotEmpty)
                    Text(_errorMsg, style: const TextStyle(color: Colors.red)),
                  
                  if (_systemFare == null)
                    ElevatedButton(
                      onPressed: _isLoading ? null : _calculateFare,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isLoading 
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('CALCULATE FARE', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    )
                  else ...[
                    // Fare Adjustment Section
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Adjust your offer (Minimum 50%)', style: TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('₦${(_systemFare! * 0.5).toStringAsFixed(0)}', style: const TextStyle(color: Colors.black54)),
                              Text('₦${_offeredFare?.toStringAsFixed(0)}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue)),
                              Text('₦${(_systemFare! * 1.5).toStringAsFixed(0)}', style: const TextStyle(color: Colors.black54)),
                            ],
                          ),
                          Slider(
                            value: _offeredFare!,
                            min: _systemFare! * 0.5,
                            max: _systemFare! * 1.5,
                            divisions: 20,
                            label: '₦${_offeredFare?.toStringAsFixed(0)}',
                            onChanged: (val) {
                              setState(() {
                                _offeredFare = val;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _isLoading ? null : _requestRide,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isLoading 
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('CONFIRM RIDE', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
