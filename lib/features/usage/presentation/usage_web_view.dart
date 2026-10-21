import 'package:flutter/material.dart';
import 'usage_web_view_stub.dart'
    if (dart.library.js_interop) 'usage_web_view_web.dart' as web_impl;

/// ZenPulseUsageWebView renders the Digital Wellbeing & Parental Controls web application
class ZenPulseUsageWebView extends StatelessWidget {
  const ZenPulseUsageWebView({super.key});

  @override
  Widget build(BuildContext context) {
    return web_impl.buildUsageWebView();
  }
}
