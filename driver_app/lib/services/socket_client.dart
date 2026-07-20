import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:flutter/foundation.dart';

class SocketClient {
  static final SocketClient _instance = SocketClient._internal();
  io.Socket? socket;

  factory SocketClient() {
    return _instance;
  }

  SocketClient._internal();

  void connect() {
    // The dispatch-service is on port 3007
    // Using production dispatch service WebSocket
    const String socketUrl = 'https://flexride-dispatch.onrender.com';

    socket = io.io(socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket!.connect();

    socket!.onConnect((_) {
      if (kDebugMode) {
        debugPrint('Driver connected to dispatch socket');
      }
    });

    socket!.onDisconnect((_) {
      if (kDebugMode) {
        debugPrint('Driver disconnected from dispatch socket');
      }
    });
  }

  void disconnect() {
    socket?.disconnect();
  }

  void onNewRideRequest(Function(dynamic) callback) {
    socket?.on('new_ride_request', callback);
  }
}
