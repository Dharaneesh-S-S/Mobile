import 'package:flutter/material.dart';
import 'money_web_view_stub.dart'
    if (dart.library.js_interop) 'money_web_view_web.dart' as web_impl;

/// RupeeFlowMoneyWebView renders the full on-device RupeeFlow Personal Money Studio
class RupeeFlowMoneyWebView extends StatelessWidget {
  const RupeeFlowMoneyWebView({super.key});

  @override
  Widget build(BuildContext context) {
    return web_impl.buildMoneyWebView();
  }
}
